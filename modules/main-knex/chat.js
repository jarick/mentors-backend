
const bcrypt = require('bcrypt')
const Bookshelf = require('bookshelf')
const Knex = require('knex')
const url = require('url')
const Amqp = require('amqp')
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
  const amqp = Amqp.createConnection({ host: 'localhost' })
  //const client = redis.createClient(config.redis)
  const online = OnlineService(client)
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
      amqp.queue((queue) => {
        queue.bind(qname)
        queue.subscribe((msg) => {
          socket.emit('message', msg)
        })
        socket.on('disconnect', () => {
          online.offline(user.id)
          io.close()
          queue.destroy()
        })
      })
/*
      client.on("message", function(channel, message) {
        if (channel === qname){
          socket.emit('message', message)
        }
      });
      client.subscribe(qname);
      socket.on('disconnect', () => {
        online.offline(user.id)
        io.close()
        q.unsubscribe()
        //client.unsubscribe(qname)
      })
*/
      return true
    } else {
      io.close()
      return false
    }
  }
}