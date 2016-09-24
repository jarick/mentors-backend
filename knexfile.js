// Update with your config settings.

module.exports = {

  development: {
    client: 'mysql',
    connection: {
      database: 'koa',
      user:     'root',
      password: ''
    },
    migrations: {
      tableName: 'migrations'
    }
  },

  staging: {
    client: 'mysql',
    connection: {
      host: 'webrtc.cqgizo6zj65i.us-west-2.rds.amazonaws.com',
      database: 'koa',
      user:     'root',
      password: 'pyh00kermysql'
    },
    migrations: {
      tableName: 'migrations'
    }
  },

  production: {
    client: 'mysql',
    connection: {
      host: 'webrtc.cqgizo6zj65i.us-west-2.rds.amazonaws.com',
      database: 'koa',
      user:     'root',
      password: 'pyh00kermysql'
    },
    migrations: {
      tableName: 'migrations'
    }
  }

};
