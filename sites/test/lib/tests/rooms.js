const assert = require('assert')
const async = require('async')
import konig from './../../../../lib'
import {config} from './config'

describe('Rooms API', () => {
  it('Responds', (done) => {
    konig(config).then((app) => {
      const request = require('co-supertest').agent(app.listen())
      async.waterfall([
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
          request
            .post('/api/v1/rooms')
            .send({active: true, type: 'private', name: 'test'})
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end((err, res) => {
              if (err) throw err
              assert(res.body.id)
              assert.equal(true, res.body.active)
              assert.equal(res.body.type, 'private')
              assert.equal(res.body.name, 'test')
              cb(null, res.body.id, token)
            })
        },
        (id, token, cb) => {
          request
            .put('/api/v1/rooms/' + id)
            .send({active: false, type: 'public', name: 'test2'})
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end((err, res) => {
              if (err) throw err
              assert.equal(false, res.body.active)
              assert.equal(res.body.type, 'public')
              assert.equal(res.body.name, 'test2')
              cb(null, id, token)
            })
        },
        (id, token, cb) => {
          request
            .delete('/api/v1/rooms/' + id)
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end((err) => {
              if (err) throw err
              cb(null, id, token)
            })
        },
        (id, token, cb) => {
          request
            .get('/api/v1/rooms')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end((err, res) => {
              if (err) throw err
              cb(null, id, token)
            })
        }
      ], (err) => done(err))
    })
  })
})