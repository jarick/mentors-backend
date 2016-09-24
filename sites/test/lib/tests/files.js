const assert = require('assert')
const async = require('async')
import konig from './../../../../lib'
import {config} from './config'

describe('Files API', () => {
  it('Responds', (done) => {
    konig(config).then((app) => {
      const request = require('co-supertest').agent(app.listen())
      const dirName = 'test_directory_files_' + Date.now()
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
            .post('/api/v1/directories')
            .set('Authorization', 'Bearer ' + token)
            .send({name: dirName})
            .expect(200)
            .end((err, res) => {
              if (err) throw err
              assert(res.body.id)
              cb(null, null, res.body.id, token)
            })
        },
        (id, dirId, token, cb) => {
          const src = 'http://wwww.ru' + Date.now()
          request
            .post('/api/v1/files')
            .send({
              src: src,
              originalName: 'test',
              directories: [dirName]
            })
            .expect(200)
            .end((err, res) => {
              if (err) throw err
              assert(res.body.id)
              assert.equal(res.body.src, src)
              assert.equal(res.body.originalName, 'test')
              assert(res.body.directories.indexOf(dirName) > -1)
              cb(null, res.body.id, dirId, token)
            })
        },
        (id, dirId, token, cb) => {
          request
            .put('/api/v1/files/' + id)
            .send({
              src: 'http://wwww2.ru',
              originalName: 'test2',
              directories: [dirName]
            })
            .expect(200)
            .end((err, res) => {
              if (err) throw err
              assert.equal(res.body.src, 'http://wwww2.ru')
              assert.equal(res.body.originalName, 'test2')
              assert(res.body.directories.indexOf(dirName) > -1)
              cb(null, id, dirId, token)
            })
        },
        (id, dirId, token, cb) => {
          request
            .get('/api/v1/files?where={"src": "www2"}')
            .expect(200)
            .end((err) => {
              if (err) throw err
              cb(null, id, dirId, token)
            })
        },
        (id, dirId, token, cb) => {
          request
            .delete('/api/v1/files/' + id)
            .expect(200)
            .end((err) => {
              if (err) throw err
              cb(null, id, dirId, token)
            })
        },
        (id, dirId, token, cb) => {
          request
            .delete('/api/v1/directories/' + dirId)
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end((err) => {
              if (err) throw err
              cb(null, id, dirId, token)
            })
        }
      ], (err) => done(err))
    })
  })
})