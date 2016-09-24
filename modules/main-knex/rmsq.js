
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Bookshelf = require('bookshelf')
const Knex = require('knex')
const RedisSMQ = require("rsmq")
const url = require('url')
const bluebird = require('bluebird')
const redis = require('redis')
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)
import {DB} from './db'
import {Auth} from  './services/auth'
import {OnlineService} from './services/online'

export function Rmsq(config) {
  const knex = Knex(config.knex)
  const bookshelf = Bookshelf(knex)
  const db = DB(bookshelf, knex)
  const auth = Auth(db)
  const client = redis.createClient(options.redis)
  const online = OnlineService(client)
  const rsmq = new RedisSMQ({
    client: client
  })
  return async (wss) => {
    const location = url.parse(wss.upgradeReq.url, true)
    const credentials = location.query.accessToken
    const me = await auth.byToken(credentials)
    if (me) {
      const user = me.user
      const qname = "chat_" + user.id
      online.add(user.id)
      rsmq.createQueue({ qname: qname }, () => {
        let updatedAt = Date.now()
        let interval = setInterval(() => {
          if (Date.now() - updatedAt > 60000) {
            try {
              online.offline(user.id)
              clearInterval(interval)
              wss.close()
              rsmq.deleteQueue({ qname: qname }, () => {})
            } catch (e) {}
          } else {
            try { wss.send('ping') } catch(e) {}
          }
        }, 1000)
        wss.on('close', () => {
          try {
            online.offline(user.id)
            clearInterval(interval)
            wss.close()
            rsmq.deleteQueue({ qname: qname }, () => {})
          } catch(e) {}
        })
        wss.on('message', () => {
          updatedAt = Date.now()
        })
        rsmq.receiveMessage({qname: qname}, (err, resp) => {
          if (resp.id) {
            try { wss.send(resp.message) } catch (e) {}
          }
        })
      })
      return true
    } else {
      wss.close()
      return false
    }
  }
}