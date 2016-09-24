const moment = require('moment')
const uuid = require('node-uuid')
const now = moment().toISOString()
const bcrypt = require('bcrypt')

exports.seed = function(knex) {
  let userId, roleId
  return knex('users')
    .insert({
        created_at: now,
        updated_at: now,
        uuid: uuid.v4(),
        state: '{}',
        login: 'admin',
        active: true
    })
    .then((data) => {
      userId = data[0]
      return data
    })
    .then(() =>
      knex('users_auth_mail').insert({
        created_at: now,
        updated_at: now,
        password: bcrypt.hashSync('passw0rd', 10),
        user_id: userId,
        mail: 'admin@email.no'
      })
    )
    .then(() =>
      knex('roles').insert({
        created_at: now,
        updated_at: now,
        uuid: uuid.v4(),
        name:	'admin'
      })
      .then((data) => {
        roleId = data[0]
        return data
      })
    )
    .then(() =>
      knex('users_roles').insert({
        user_id: userId,
        role_id: roleId
      })
    )
}
