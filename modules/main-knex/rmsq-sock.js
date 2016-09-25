
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

export function RmsqSocketIo(config) {
  const knex = Knex(config.knex)
  const bookshelf = Bookshelf(knex)
  const db = DB(bookshelf, knex)
  const auth = Auth(db)
  const client = redis.createClient(config.redis)
  const online = OnlineService(client)
  const rsmq = new RedisSMQ({
    client: client
  })
  return async (io, socket) => {
    if (!socket.handshake.query.token) {
      io.close()
      return false
    }
    const me = await auth.byToken(socket.handshake.query.token)
    if (me) {
      const user = me.user
      const qname = "chat_" + user.id
      online.add(user.id)
      rsmq.createQueue({ qname: qname }, () => {
        socket.on('disconnect', () => {
          online.offline(user.id)
          io.close()
          rsmq.deleteQueue({ qname: qname }, () => {})
        })
        rsmq.receiveMessage({qname: qname}, (err, resp) => {
          if (resp.id) {
            socket.emit('message', resp.message)
          }
        })
      })
      return true
    } else {
      io.close()
      return false
    }
  }
}