
const assert = require('assert')
const async = require('async')
const path = require('path')
const fs = require('fs')
const SocketIO = require('socket.io')
const SocketIoClient = require('socket.io-client')
const test = require('co-supertest')
import konig from './../../../../lib/index'
import { config, configMain } from './config'
import { Chat } from './../../../../modules/main-knex/chat'

describe('Chat API', function (){
  this.timeout(5000)
  it('Responds', (done) => {
    konig(config).then((app) => {
      const listen = app.listen(3011)
      const io = SocketIO(listen)
      io.on('connection', (socket) => {
        Chat(configMain)(io, socket).then(
          (result) => assert(result), (err) => done(err)
        )
      })
      listen.on('listening', function() {
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
            const client = SocketIoClient('http://localhost:3011', {
              query: 'token=' + token
            })
            client.on('connect', () => {
              cb(null, token)
            });
            client.on('message', (data) => {
              assert(data, '{"result":"ok"}')
              done()
            });
            client.on('disconnect', () => {
              cb(new Error('disconnect'))
            });
            client.on('error', (err) => {
              cb(err)
            })
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
          }
        ], (err) => {
            if (err) {
              done(err)
            }
        })
      })
    }, (err) => done(err))
  })
})