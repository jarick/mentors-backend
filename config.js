
const path = require('path')

module.exports = {
  path: path.join(__dirname, 'modules', 'main-knex'),
  tests: path.join(__dirname, 'sites', 'test', 'lib', 'tests'),
  views: path.join(__dirname, 'lib', 'cli', 'views'),
  mysql: {
    database: 'koa',
    user:     'root',
    password: ''
  }
}