const moment = require('moment')
const uuid = require('node-uuid')
const now = moment().toISOString()
const bcrypt = require('bcrypt')

exports.up = (knex, Promise) => {
  let adminId
  return Promise.all([

    knex.schema.createTableIfNotExists('users_auth_mail', (table) => {
      table.increments()
      table.timestamps()
      table.string('password', 255)
      table.string('token_hash', 255)
      table.string('checkword_hash', 255)
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('RESTRICT').notNullable()
      table.string('mail', 255).notNullable()
      table.unique('mail')
    }),

    knex.schema.createTableIfNotExists('users_auth_sms', (table) => {
      table.increments()
      table.timestamps()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('RESTRICT').notNullable()
      table.string('token_hash', 255)
      table.string('code_hash', 255)
      table.string('password', 255)
      table.string('phone', 255).notNullable()
      table.string('country', 2).notNullable()
      table.string('push_token', 255)
      table.string('device_id', 255)
      table.string('device_type', 255)
    }),

    knex.schema.createTableIfNotExists('users', (table) => {
      table.increments()
      table.timestamps()
      table.uuid('uuid').unique()
      table.text('state').notNullable()
      table.string('login', 50).unique().notNullable()
      table.boolean('active')
      table.string('name')
      table.string('last_name')
      table.string('second_name')
      table.dateTime('last_login')
      table.dateTime('last_activity_date')
      table.text('admin_notes')
      table.string('avatar', 255)
      table.string('external_auth_id', 255)
    }),

    knex.schema.createTableIfNotExists('roles', (table) => {
      table.increments()
      table.timestamps()
      table.uuid('uuid').unique()
      table.string('name', 255).unique()
    }),
    knex.schema.createTableIfNotExists('users_roles', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('RESTRICT').notNullable()
      table.integer('role_id').unsigned().references('id').inTable('roles').onDelete('CASCADE').onUpdate('RESTRICT').notNullable()
    }),

    knex.schema.createTableIfNotExists('files', (table) => {
      table.increments()
      table.timestamps()
      table.uuid('uuid').unique()
      table.integer('height')
      table.integer('width')
      table.integer('file_size')
      table.string('content_type', 255)
      table.string('src', 255).unique().notNullable()
      table.string('original_name', 255)
      table.string('description', 255)
    }),
    knex.schema.createTableIfNotExists('directories', (table) => {
      table.increments()
      table.timestamps()
      table.uuid('uuid').unique()
      table.string('name', 255).unique()
    }),
    knex.schema.createTableIfNotExists('files_directories', (table) => {
      table.increments()
      table.integer('directory_id').unsigned().references('id').inTable('directories').onDelete('CASCADE').onUpdate('RESTRICT').notNullable()
      table.integer('file_id').unsigned().references('id').inTable('files').onDelete('CASCADE').onUpdate('RESTRICT').notNullable()
    }),

    knex.schema.createTableIfNotExists('objects', (table) => {
      table.increments()
      table.timestamps()
      table.uuid('uuid').unique()
      table.string('external_id', 255)
      table.boolean('active')
      table.string('code', 50).unique().notNullable()
      table.string('name', 255).notNullable()
      table.text('description')
      table.text('acl').notNullable()
      table.text('permissions').notNullable()
      table.text('fields').notNullable()
    }),
    knex.schema.createTableIfNotExists('comments', (table) => {
      table.increments()
      table.timestamps()
      table.boolean('active')
      table.uuid('uuid').unique()
      table.string('picture', 255)
      table.string('displayName', 255)
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('RESTRICT')
      table.text('text').notNullable()
      table.integer('item_id')
      table.integer('object_id').unsigned().references('id').inTable('objects').onDelete('CASCADE').onUpdate('RESTRICT')
    }),
    knex.schema.createTableIfNotExists('fields', (table) => {
      table.increments()
      table.timestamps()
      table.uuid('uuid').unique()
      table.string('name', 255).notNullable()
      table.enum('type', [
        'string', 'boolean', 'integer', 'text', 'float', 'date', 'datetime', 'time', 'timestamp'
      ]).notNullable()
      table.boolean('not_null').notNullable()
      table.text('schema').notNullable()
      table.integer('item_id')
      table.integer('object_id').unsigned().references('id').inTable('objects').onDelete('CASCADE').onUpdate('RESTRICT')
    }),
    knex.schema.createTableIfNotExists('tags', (table) => {
      table.increments()
      table.timestamps()
      table.uuid('uuid').unique()
      table.string('name', 255).unique()
    }),
    knex.schema.createTableIfNotExists('objects_tags', (table) => {
      table.increments()
      table.integer('object_id').unsigned().references('id').inTable('objects').onDelete('CASCADE').onUpdate('RESTRICT').notNullable()
      table.integer('tag_id').unsigned().references('id').inTable('tags').onDelete('CASCADE').onUpdate('RESTRICT').notNullable()
    }),
    knex.schema.createTableIfNotExists('ratings', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('RESTRICT').notNullable()
      table.integer('item_id').notNullable()
      table.integer('object_id').unsigned().references('id').inTable('objects').onDelete('CASCADE').onUpdate('RESTRICT').notNullable()
      table.integer('value').unsigned().notNullable()
    }),
    knex.schema.createTableIfNotExists('votes', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('RESTRICT').notNullable()
      table.integer('element_id').notNullable()
      table.integer('object_id').unsigned().references('id').inTable('objects').onDelete('CASCADE').onUpdate('RESTRICT').notNullable()
      table.enum('vote', ['positive', 'negative']).notNullable()
    }),

    knex.schema.createTableIfNotExists('rooms', (table) => {
      table.increments()
      table.timestamps()
      table.uuid('uuid').unique()
      table.boolean('active')
      table.integer('author').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('RESTRICT').notNullable()
      table.enum('type', ['public', 'private']).notNullable()
      table.string('name', 255).notNullable()
    }),
    knex.schema.createTableIfNotExists('rooms_roles', (table) => {
      table.increments()
      table.integer('room_id').unsigned().references('id').inTable('rooms').onDelete('CASCADE').onUpdate('RESTRICT').notNullable()
      table.integer('role_id').unsigned().references('id').inTable('roles').onDelete('CASCADE').onUpdate('RESTRICT').notNullable()
    }),
    knex.schema.createTableIfNotExists('rooms_users', (table) => {
      table.increments()
      table.integer('room_id').unsigned().references('id').inTable('rooms').onDelete('CASCADE').onUpdate('RESTRICT').notNullable()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('RESTRICT').notNullable()
    }),

    //lookchat
    knex.schema.createTableIfNotExists('friends', (table) => {
      table.increments()
      table.timestamps()
      table.uuid('uuid').unique()
      table.string('name', 255)
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('RESTRICT').notNullable()
      table.integer('profile').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('RESTRICT').notNullable()
    })
  ])
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTableIfExists('friends'),

    knex.schema.dropTableIfExists('rooms_roles'),
    knex.schema.dropTableIfExists('rooms_users'),
    knex.schema.dropTableIfExists('rooms'),

    knex.schema.dropTableIfExists('votes'),
    knex.schema.dropTableIfExists('ratings'),
    knex.schema.dropTableIfExists('objects_tags'),
    knex.schema.dropTableIfExists('tags'),
    knex.schema.dropTableIfExists('fields'),
    knex.schema.dropTableIfExists('comments'),
    knex.schema.dropTableIfExists('objects'),

    knex.schema.dropTableIfExists('files_directories'),
    knex.schema.dropTableIfExists('directories'),
    knex.schema.dropTableIfExists('files'),

    knex.schema.dropTableIfExists('users_roles'),
    knex.schema.dropTableIfExists('roles'),
    knex.schema.dropTableIfExists('users'),
  ])
};
