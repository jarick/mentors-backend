
const assert = require('assert')
const async = require('async')
const path = require('path')
const fs = require('fs')
const WebSocketServer = require('ws').Server
const WebSocket = require('ws');
const test = require('co-supertest')
import konig from './../../../../lib'
import {config, configMain} from './config'
import {Rmsq} from './../../../../modules/main-knex/rmsq'

describe('Chat API', function (){
  this.timeout(5000)
  it('Responds', (done) => {
    konig(config).then((app) => {
      const listen = app.listen(3011)
      const ws = new WebSocketServer({server: listen})
      ws.on('connection', (wss) => {
        Rmsq(configMain)(wss).then(
          (result) => assert(result), (err) => done(err)
        )
      })
      ws.on('listening', () => {
        const request = test.agent(listen)
        async.waterfall([
          (cb) => {
            setTimeout(() => cb(null), 500)
          },
          (cb) => {
            request
              .post('/api/v1/authorization/mail/login')
              .send({
                mail: 'admin@email.no',
                password: "passw0rd"
              })
              .expect(200)
              .end((err, res) => {
                if (err) throw err
                assert.equal(res.body.result, 'ok')
                cb(null, res.body.token)
              })
          },
          (token, cb) => {
            const socket = new WebSocket('ws://localhost:3011/?accessToken=' + token)
            socket.onopen = () => {
              console.log("Соединение установлено.")
              cb(null, token)
            }
            socket.onclose = (event) => {
              if (event.wasClean) {
                console.log('Соединение закрыто чисто')
              } else {
                console.log('Обрыв соединения')
              }
              console.log('Код: ' + event.code + ' причина: ' + event.reason)
            }
            socket.onmessage = (event) => {
              console.log("Получены данные " + event.data)
            }
            socket.onerror = (error) => {
              console.error(error)
            }
          },
          (token, cb) => {
            request
              .post('/api/v1/rooms')
              .send({
                active: true,
                type: 'private',
                name: 'test_' + Date.now(),
                members: [1]
              })
              .set('Authorization', 'Bearer ' + token)
              .expect(200)
              .end((err, res) => {
                if (err) throw err
                assert(res.body.uuid)
                cb(null, token, res.body.uuid)
              })
          },
          (token, room,  cb) => {
            request
              .post('/api/v1/chat/messages')
              .send({
                room: room,
                body: JSON.stringify({result: 'ok'})
              })
              .set('Authorization', 'Bearer ' + token)
              .expect(200)
              .end((err, res) => {
                if (err) throw err
                assert.equal(res.body.result, 'ok')
                cb(null, token, room)
              })
          },
          (token, room, cb) => {
            setTimeout(() => cb(null), 500)
          },
        ], (err) => done(err))
      })
    })
  })
})