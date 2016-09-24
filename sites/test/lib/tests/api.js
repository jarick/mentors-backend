
const assert = require('assert')
import konig from './../../../../lib'
import {config} from './config'
import {Api} from  './../../../../modules/main-knex/api'

const test = async () => {
  const app = await konig(config)
  await new Promise((resolve, reject) => {
    app.listen(3000, (err) => {
      if (err) reject(err)
      else resolve(true)
    })
  })
  const api = await Api('http://127.0.0.1:3000/api/v1', 'admin@email.no', 'passw0rd')
  const dir = await api.directories.create({
    name: 'test_dir_api_' + Date.now()
  })
  assert(dir.id)
}
describe('Api', function() {
  it('Directory', (done) => {
    test().then(() => done(), (err) => done(err))
  })
})