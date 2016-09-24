
const path = require('path')
import main from './../modules/main-knex'

export const config = {
  emitter: {
    maxListeners: 20
  },
  logs: path.join(path.dirname(__dirname), 'logs'),
  modules: {
    main: main({
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
          host: 'localhost',
          user: '<login>',
          password: '<password>',
          database: '<database>'
        }
      },
      smtp: {
        transporter: '<smtp>',
        mail: {
          from: '<from>',
          subject: '<subject>',
          text: 'Your confirm code: #@code#'
        }
      }
    }),
  }
}