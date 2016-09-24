
const assert = require('assert')
const async = require('async')
const path = require('path')
const fs = require('fs')
import konig from './../../../../lib'
import {config} from './config'
const SMTPServer = require('smtp-server').SMTPServer;

describe('Profile API', function (){
  it('Responds', (done) => {
    let server
    let mail = 'test_' + Date.now() + '@test.com'
    konig(config).then((app) => {
      const request = require('co-supertest').agent(app.listen())
      async.waterfall([
        (cb) => {
          const writeStream = fs.createWriteStream(path.join(__dirname, 'tmp.txt'))
          server = new SMTPServer({
            onAuth: (auth, session, callback) => {
              callback(null, {user: 1})
            },
            onData: (stream, session, callback) => {
              stream.pipe(writeStream)
              stream.on('end', callback)
            }
          })
          server.listen(2525, 'localhost', (error) => {
            cb(error)
          })
        },
        (cb) => {
          request
            .post('/api/v1/authorization/mail/send')
            .send({
              mail: mail
            })
            .expect(200)
            .end((err, res) => {
              if (err) throw err
              assert.equal(res.body.result, 'ok')
              setTimeout(() => {
                const file = path.join(__dirname, 'tmp.txt')
                let content = '';
                const readStream = fs.createReadStream(file, 'utf8');
                readStream
                  .on('data', (chunk) => content += chunk)
                  .on('end', () => {
                    const match = content.match(/Your confirm code: (\w+),/)
                    assert(match[1])
                    cb(null, res.body.id, match[1])
                  });
              }, 300);
            })
        },
        (id, checkword, cb) => {
          request
            .post('/api/v1/authorization/mail/verify')
            .send({
              id: id,
              checkword: checkword,
              password: "qwerty1902"
            })
            .expect(200)
            .end((err, res) => {
              if (err) throw err
              assert.equal(res.body.result, 'ok')
              cb(null, id, checkword)
            })
        },
        (id, checkword, cb) => {
          request
            .post('/api/v1/authorization/mail/login')
            .send({
              mail: mail,
              password: "qwerty1902"
            })
            .expect(200)
            .end((err, res) => {
              if (err) throw err
              assert.equal(res.body.result, 'ok')
              cb(null, id, checkword, res.body.token)
            })
        },
        (id, checkword, token, cb) => {
          request
            .get('/api/v1/profile')
            .set('Authorization', 'Bearer ' + token)
            .send()
            .expect(200)
            .end((err, res) => {
              if (err) throw err
              cb(null, id, checkword, token)
            })
        },
        (id, checkword, token, cb) => {
          request
            .post('/api/v1/profile')
            .set('Authorization', 'Bearer ' + token)
            .send({
              name: 'qwerty'
            })
            .expect(200)
            .end((err, res) => {
              if (err) throw err
              assert.equal(res.body.name, 'qwerty')
              cb(null, id, checkword, token)
            })
        },
      ], (err) => {
        if (server) {
          server.close()
        }
        fs.unlinkSync(path.join(__dirname, 'tmp.txt'))
        done(err)
      })
    })
  })
})