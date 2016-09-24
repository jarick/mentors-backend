const assert = require('assert')
const async = require('async')
import konig from './../../../../lib'
import {config} from './config'

describe('Fields API', () => {
  it('Responds', (done) => {
    konig(config).then((app) => {
      const request = require('co-supertest').agent(app.listen())
      let objId
      const obj = 'test_fields_' + Date.now()
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
              code: obj,
              name: 'test object',
              acl: '{"*": 1, "admin": 7}',
              permissions: '{"test": {"*": 1, "admin": 7}}'
            })
            .expect(200)
            .end((err, res) => {
              if (err) throw err
              assert(res.body.id)
              objId = res.body.id
              cb(null, token, null)
            })
        },
        (token, id, cb) => {
          request
            .post('/api/v1/fields')
            .set('Authorization', 'Bearer ' + token)
            .send({
              name: 'test_field',
              type: 'string',
              notNull: true,
              schema: '{"type": "string", "maxLength": 255}',
              object: obj
            })
            .expect(200)
            .end((err, res) => {
              if (err) throw err
              assert(res.body.id)
              assert.equal(res.body.name, 'test_field')
              assert.equal(res.body.type, 'string')
              assert.equal(res.body.notNull, true)
              assert.equal(res.body.schema.type, 'string')
              assert.equal(res.body.object, obj)
              cb(null, token, res.body.id)
            })
        },
        (token, id, cb) => {
          request
            .put('/api/v1/fields/' + id)
            .set('Authorization', 'Bearer ' + token)
            .send({
              name: 'test_field_2',
              type: 'string',
              notNull: true,
              schema: '{"type": "string", "maxLength": 255}',
              object: obj
            })
            .expect(200)
            .end((err, res) => {
              if (err) throw err
              assert(res.body.id)
              assert.equal(res.body.name, 'test_field_2')
              assert.equal(res.body.type, 'string')
              assert.equal(res.body.notNull, true)
              assert.equal(res.body.schema.type, 'string')
              assert.equal(res.body.object, obj)
              cb(null, token, id)
            })
        },
        (token, id, cb) => {
          request
            .delete('/api/v1/fields/' + id)
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end((err) => {
              if (err) throw err
              cb(null, token, id)
            })
        },
        (token, id, cb) => {
          request
            .get('/api/v1/fields')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end((err) => {
              if (err) throw err
              cb(null, token, id)
            })
        },
        (token, id, cb) => {
          request
            .delete('/api/v1/objects/' + objId)
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end((err) => {
              if (err) throw err
              cb(null, token, id)
            })
        }
      ], (err) => done(err))
    })
  })
})