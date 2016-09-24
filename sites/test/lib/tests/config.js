const path = require('path')
import main from './../../../../modules/main-knex'

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
        from: '"LookChat" <support@lookchat.me>',
          subject: 'Confirm your authorization',
          text: 'Your confirm code: #@code#, id: #@id#'
      }
    }
  },
  sms: {
    accountSid: 'ACa706bcada5933c32c8924f2902e54542',
      authToken: 'a98d12be39a9374ef83d045e529cc1b4',
      messages: {
      code: {
        from: '+12016307364',
          body: 'Your confirm code: #@code#, id: #@id#'
      }
    }
  },
  push: {
    gcm: {
      token: "AIzaSyA6bWiX1XOEuAN1iSBZZ6Fq93yzx-pfelA"
    }
  }
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