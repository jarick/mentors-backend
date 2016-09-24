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
      host : 'eu-cdbr-west-01.cleardb.com',
      user : 'bd04e6f98278bb',
      password : 'be08a89d',
      database : 'heroku_0df0b3d2207582f'
    },
    migrations: {
      tableName: 'migrations'
    }
  },

  production: {
    client: 'mysql',
    connection: {
      host : 'eu-cdbr-west-01.cleardb.com',
      user : 'bd04e6f98278bb',
      password : 'be08a89d',
      database : 'heroku_0df0b3d2207582f'
    },
    migrations: {
      tableName: 'migrations'
    }
  }

};
