
const fs = require('fs')
const path = require('path')
const Koa = require('koa')
const morgan = require('koa-morgan')
const debug = require('debug')('konigjs')
const Router = require('koa-router')
import errorHandler from './errors/handler'
import * as errors from './errors/index'
const bodyParser = require('koa-bodyparser');

export default async (options) => {
  const koa = new Koa()

  if (options.static) {
    koa.use(require('koa-static')(options.static.folder, options.static.options));

    if (options.static.upload) {
      const multer = require('koa-multer')
      const upload = multer({ dest: options.static.folder })
      router = new Router()
      router.post('/api/v2/upload', upload.single('file'))
      koa.use(router.routes(), router.allowedMethods());
    }
  }

  koa.use(bodyParser());

  if (options.logs) {
    const logDirectory = options.logs
    fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
    const accessLogStream = fs.createWriteStream(path.join(logDirectory, 'api.log'), { flags: 'a' })
    morgan.token('body', (req) => {
      return JSON.stringify(req.body)
    })
    morgan.token('json', (req, res) => {
      return JSON.stringify(res.json)
    })
    koa.use(morgan('[:date[clf]] :method :url :body :json :status :response-time', {stream: accessLogStream}))
  }

  koa.use(async (ctx, next) => {
    debug('request: [%s] %s', ctx.request.method, ctx.request.url)
    try {
      ctx.options = options
      ctx.errors = errors
      await next()
      if (ctx.status === 404) {
        throw errors.NotFoundHttpException()
      }
      debug('response: [%s] %s', ctx.status, JSON.stringify(ctx.body))
    } catch (e) {
      console.log(e)
      errorHandler(e, ctx)
      debug('error: [%s] %s', ctx.status, JSON.stringify(e))
    }

  })

  await options.modules.main.start(koa)

  return koa
}