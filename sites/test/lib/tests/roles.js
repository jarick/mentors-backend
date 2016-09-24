const assert = require('assert')
const async = require('async')
import konig from './../../../../lib'
import {config} from './config'

describe('Roles API', () => {
  it('Responds', (done) => {
    konig(config).then((app) => {
      const request = require('co-supertest').agent(app.listen())
      const name = 'test_role_' + Date.now()
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
            .post('/api/v1/roles')
            .set('Authorization', 'Bearer ' + token)
            .send({name: name})
            .expect(200)
            .end((err, res) => {
              if (err) throw err
              assert(res.body.id)
              assert.equal(res.body.name, name)
              cb(null, res.body.id, token)
            })
        },
        (id, token, cb) => {
          request
            .put('/api/v1/roles/' + id)
            .set('Authorization', 'Bearer ' + token)
            .send({name: name + '_2'})
            .expect(200)
            .end((err, res) => {
              if (err) throw err
              assert.equal(res.body.name, name + '_2')
              assert.equal(200, res.status)
              cb(null, id, token)
            })
        },
        (id, token, cb) => {
          request
            .get('/api/v1/roles')
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
            .delete('/api/v1/roles/' + id)
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