const moment = require('moment')
const uuid = require('node-uuid')
const Knex = require('knex')
const co = require('co')

const knexOld = Knex({
  client: 'mysql',
  connection: {
    host : 'webrtc.cqgizo6zj65i.us-west-2.rds.amazonaws.com',
    user : 'root',
    password : 'pyh00kermysql',
    database : 'webrtc'
  }
});

const knexNew = Knex({
  client: 'mysql',
  connection: {
    host : 'webrtc.cqgizo6zj65i.us-west-2.rds.amazonaws.com',
    user : 'root',
    password : 'pyh00kermysql',
    database : 'koa'
  }
});

const now = moment().toISOString()
co(function *() {
  const list = yield knexOld('country').select()
  for (let item of list) {
    yield knexNew('obj_countries').insert({
      created_at: now,
      updated_at: now,
      uuid: uuid.v4(),
      iso: item.iso,
      codes: item.codes,
      name: item.name
    })
  }
}).then(() => console.log('success'), (err) => console.error(err))
