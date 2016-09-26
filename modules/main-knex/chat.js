
const bcrypt = require('bcrypt')
const Bookshelf = require('bookshelf')
const Knex = require('knex')
const url = require('url')
const Amqp = require('rabbit.js')
const bluebird = require('bluebird')
const redis = require('redis')
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)
import {DB} from './db'
import {Auth} from  './services/auth'
import {OnlineService} from './services/online'

export function Chat(config) {
  const knex = Knex(config.knex)
  const bookshelf = Bookshelf(knex)
  const db = DB(bookshelf, knex)
  const auth = Auth(db)
  const amqp = Amqp.createContext(config.amqp)
  const client = redis.createClient(config.redis)
  const online = OnlineService(client)
  return async (io, socket) => {
    if (!socket.handshake.query.token) {
      io.close()
      return false
    }
    const me = await auth.byToken(socket.handshake.query.token)
    if (me) {
      const user = me.user
      online.add(user.id)
      const sub = amqp.socket('SUB')
      sub.setEncoding('utf8');
      sub.on('data', (msg) => {
        socket.emit('message', msg)
      })
      sub.connect("chat_" + user.id)
      socket.on('disconnect', () => {
        online.offline(user.id)
        sub.close()
      })
      return true
    } else {
      io.close()
      return false
    }
  }
}