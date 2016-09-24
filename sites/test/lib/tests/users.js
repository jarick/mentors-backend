const assert = require('assert')
const async = require('async')
import konig from './../../../../lib'
import {config} from './config'

describe('Users API', function() {
  this.timeout(3000)
  it('Responds', (done) => {
    konig(config).then((app) => {
      const request = require('co-supertest').agent(app.listen())
      const role = 'test_role_user_' + Date.now()
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
            .post('/api/v1/roles')
            .set('Authorization', 'Bearer ' + token)
            .send({name: role})
            .expect(200)
            .end((err, res) => {
              if (err) throw err
              assert(res.body.id)
              cb(null, null, res.body.id, token)
            })
        },
        (id, roleId, token, cb) => {
          request
            .post('/api/v1/users')
            .set('Authorization', 'Bearer ' + token)
            .send({
              login: 'test_user',
              name: 'test',
              roles: [role],
              state: '{}'
            })
            .expect(200)
            .end((err, res) => {
              if (err) throw err
              assert(res.body.id)
              assert.equal(res.body.login, 'test_user')
              assert.equal(res.body.name, 'test')
              cb(null, res.body.id, roleId, token)
            })
        },
        (id, roleId, token, cb) => {
          request
            .put('/api/v1/users/' + id)
            .set('Authorization', 'Bearer ' + token)
            .send({
              login: 'test_user',
              name: 'test2',
              roles: [role],
              state: '{}'
            })
            .expect(200)
            .end((err, res) => {
              if (err) throw err
              assert.equal(res.body.login, 'test_user')
              assert.equal(res.body.name, 'test2')
              cb(null, id, roleId, token)
            })
        },
        (id, roleId, token, cb) => {
          request
            .get('/api/v1/users')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end((err) => {
              if (err) throw err
              cb(null, id, roleId, token)
            })
        },
        (id, roleId, token, cb) => {
          request
            .delete('/api/v1/users/' + id)
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end((err) => {
              if (err) throw err
              cb(null, id, roleId, token)
            })
        },
        (id, roleId, token, cb) => {
          request
            .delete('/api/v1/roles/' + roleId)
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end((err) => {
              if (err) throw err
              cb(null, id, roleId, token)
            })
        }
      ], (err) => done(err))
    })
  })
})