const path = require('path')
import main from './../../../../modules/main-knex/index'

export const configMain = {
  api: {
    prefix: '/api/v1'
  },
  redis: {
    host: 'localhost',
      port: 6379
  },
  knex: {
    client: 'mysql',
      connection: {
      host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'koa',
        charset: 'utf8'
    }
  },
  smtp: {
    transporter: {
      secure: false,
        host: 'localhost',
        auth: {
        user: "test",
          password: "test"
      },
      port: 2525,
        tls:{
        rejectUnauthorized: false
      }
    },
    messages: {
      code: {
        from: '"Test site" <support@lookchat.me>',
          subject: 'Confirm your authorization',
          html: 'Your confirm code: #@code#, id: #@id#'
      }
    }
  },
  amqp: 'amqp://localhost'
}

export const config = {
  emitter: {
    maxListeners: 20
  },
  logs: path.join(path.dirname(path.dirname(__dirname)), 'logs'),
  modules: {
    main: main(configMain),
  }
}