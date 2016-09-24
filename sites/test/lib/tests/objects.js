const assert = require('assert')
const async = require('async')
import konig from './../../../../lib'
import {config} from './config'

describe('Objects API', () => {
  it('Responds', (done) => {
    konig(config).then((app) => {
      const request = require('co-supertest').agent(app.listen())
      const tagName = 'test_tag_objects_' + Date.now()
      let tagId
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
              cb(null, null, res.body.token)
            })
        },
        (id, token, cb) => {
          request
            .post('/api/v1/tags')
            .send({name: tagName})
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end((err, res) => {
              if (err) throw err
              assert(res.body.id)
              tagId = res.body.id
              cb(null, res.body.id, token)
            })
        },
        (id, token, cb) => {
          request
            .post('/api/v1/objects')
            .send({
              active: true,
              code: 'test_' + Date.now(),
              name: 'test object',
              acl: '{"*": 1, "admin": 7}',
              permissions: '{"test": {"*": 1, "admin": 7}}'
            })
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end((err, res) => {
              if (err) throw err
              assert(res.body.id)
              assert.equal(res.body.active, true)
              assert(res.body.code)
              assert.equal(res.body.name, 'test object')
              assert(res.body.acl.admin == 7)
              assert(res.body.permissions.test.admin == 7)
              cb(null, res.body.id, token)
            })
        },
        (id, token, cb) => {
          request
            .put('/api/v1/objects/' + id)
            .send({
              active: false,
              code: 'test_' + Date.now(),
              name: 'test object 2',
              acl: '{"*": 1, "admin": 6}',
              permissions: '{"test": {"*": 1, "admin": 6}}'
            })
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end((err, res) => {
              if (err) throw err
              assert.equal(res.body.active, false)
              assert(res.body.code)
              assert.equal(res.body.name, 'test object 2')
              assert(res.body.acl.admin == 6)
              assert(res.body.permissions.test.admin == 6)
              cb(null, id, token)
            })
        },
        (id, token, cb) => {
          request
            .get('/api/v1/objects')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end((err, res) => {
              if (err) throw err
              assert(res.body.items)
              cb(null, id, token)
            })
        },
        (id, token, cb) => {
          request
            .delete('/api/v1/objects/' + id)
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end((err) => {
              if (err) throw err
              cb(null, id, token)
            })
        },
        (id, token, cb) => {
          request
            .delete('/api/v1/tags/' + tagId)
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end((err) => {
              if (err) throw err
              cb(null, id, token)
            })
        }
      ], (err) => done(err))
    })
  })
})