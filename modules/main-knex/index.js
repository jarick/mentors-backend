
const path = require('path')
const Bookshelf = require('bookshelf')
const Knex = require('knex')
const bluebird = require('bluebird')
const redis = require('redis')
const RedisSMQ = require("rsmq")
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)
const EventEmitter2 = require('eventemitter2').EventEmitter2
import {Module} from './../../lib/rest/index'
import {DB} from './db'
import {ModuleRouter} from './routes'
import Validator from './services/ajv'
import {Auth} from './services/auth'
import {PushService} from './services/pushes'
import {AuthRequest} from './auth'
import {OnlineService} from './services/online'

export default (options) => {
  return Module({
    version: '0.0.1',
    name: 'main',
    async start(koa) {
      const emitter = new EventEmitter2(options.emitter)
      const client = redis.createClient(options.redis)
      const knex = Knex(options.knex)
      const bookshelf = Bookshelf(knex)
      const pushes = PushService(options.push)
      const ajv = Validator(knex)
      const db = DB(bookshelf, knex)
      const online = OnlineService(client)
      bookshelf.plugin('pagination')
      koa.use(async (ctx, next) => {
        ctx.redis = client
        ctx.emitter = emitter
        ctx.knex = knex
        ctx.db = db
        ctx.ajv = ajv
        ctx.rsmq = new RedisSMQ({client: client})
        ctx.auth = Auth(db, client)
        ctx.pushes = pushes
        ctx.mainOptions = options
        ctx.online = online
        await AuthRequest(ctx)
        await next()
      })

      const router = ModuleRouter(options.api.prefix)
      koa.use(router.allowedMethods())
      koa.use(router.routes())
      //await load other modules
      await emitter.emitAsync('validators', ajv, knex)
    }
  })
}