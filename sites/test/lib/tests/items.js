const assert = require('assert')
const async = require('async')
import konig from './../../../../lib'
import {config} from './config'

describe('Items API', () => {
  it('Responds', (done) => {
    konig(config).then((app) => {
      const request = require('co-supertest').agent(app.listen())
      const objName = 'test_items_' + Date.now()
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
            .post('/api/v1/objects')
            .set('Authorization', 'Bearer ' + token)
            .send({
              active: true,
              code: objName,
              name: 'test object',
              acl: '{"*": 1, "admin": 7}',
              permissions: '{"test": {"*": 1, "admin": 7}}'
            })
            .expect(200)
            .end((err, res) => {
              if (err) throw err
              assert(res.body.id)
              cb(null, null, res.body.id, token)
            })
        },
        (id, objId, token, cb) => {
          request
            .post('/api/v1/fields')
            .set('Authorization', 'Bearer ' + token)
            .send({
              name: 'test',
              type: 'string',
              notNull: true,
              schema: '{"type": "string", "maxLength": 255}',
              object: objName
            })
            .expect(200)
            .end((err, res) => {
              if (err) throw err
              assert(res.body.id)
              cb(null, null, objId, token)
            })
        },
        (id, objId, token, cb) => {
          request
            .post('/api/v1/' + objName)
            .send({
              test: 'test',
            })
            .expect(200)
            .end((err, res) => {
              if (err) throw err
              assert(res.body.id)
              assert.equal(res.body.test, 'test')
              cb(null, res.body.id, objId, token)
            })
        },
        (id, objId, token, cb) => {
          request
            .put('/api/v1/' + objName + '/' + id)
            .send({
              test: 'test2',
            })
            .expect(200)
            .end((err, res) => {
              if (err) throw err
              assert.equal(res.body.test, 'test2')
              cb(null, id, objId, token)
            })
        },
        (id, objId, token, cb) => {
          request
            .get('/api/v1/' + objName)
            .send()
            .expect(200)
            .end((err, res) => {
              if (err) throw err
              cb(null, id, objId, token)
            })
        },
        (id, objId, token, cb) => {
          request
            .delete('/api/v1/' + objName + '/' + id)
            .send()
            .expect(200)
            .end((err, res) => {
              if (err) throw err
              cb(null, id, objId, token)
            })
        },
        (id, objId, token, cb) => {
          request
            .delete('/api/v1/objects/' + objId)
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end((err) => {
              if (err) throw err
              cb(null, id, objId, token)
            })
        }
      ], (err) => done(err))
    })
  })
})