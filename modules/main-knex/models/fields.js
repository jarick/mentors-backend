
import type {Filter} from './../tables'
import type {FieldEntity} from '../tables/fields'
const moment = require('moment')
const uuid = require('node-uuid')

const types = {
  string: (table, name) => 'varchar(255)',
  boolean: (table, name) => 'tinyint(1)',
  integer: (table, name) => 'integer',
  text: (table, name) => 'text',
  float: (table, name) => 'float',
  date: () => 'date',
  datetime: () => 'datetime',
  time: () => 'time',
  timestamp: () => 'timestamp'
}
export default {
  create(db, errors, knex) {
    return async (data: FieldEntity, t) => {
      const now = moment().toISOString()
      const entity = new db.Field()
      const obj = await db.Object.where({code: data.object}).fetch({transacting: t})
      delete data.object
      await entity.save({
        created_at: now,
        updated_at: now,
        uuid: uuid.v4(),
        object_id: obj.id,
        ...data
      }, {transacting: t})
      const sql = 'alter table obj_' + obj.get('code') + ' add column '
        + entity.get('name') + ' ' + types[entity.get('type')]() + ' '
        + ((entity.get('not_null') > 0) ? 'NOT NULL' : '')
      await knex.schema.raw(sql)
      return await entity.toArray()
    }
  },
  update(db, errors, knex) {
    return async (id: number, data: FieldEntity, t) => {
      const now = moment().toISOString()
      const obj = await db.Object.where({code: data.object}).fetch({transacting: t})
      delete data.object
      const old = await new db.Field({id: id}).fetch({transacting: t})
      if (!old) {
        throw errors.NotFoundHttpException()
      }
      let entity
      entity = await new db.Field({id: id}).save({
        updated_at: now,
        object_id: obj.id,
        ...data
      }, {transacting: t})
      if (
        old.get('name') !== entity.get('name')
        || old.get('type') !== entity.get('type')
        || old.get('not_null') !== entity.get('not_null')
      ) {
        const sql = 'alter table obj_' + obj.get('code') + ' change column '
          + old.get('name') + ' '
          + entity.get('name') + ' ' + types[entity.get('type')]() + ' '
          + ((entity.get('not_null') > 0) ? 'NOT NULL' : '')
        await knex.schema.raw(sql)
      }
      return await entity.toArray()
    }
  },
  remove(db, errors, knex) {
    return async (id: number, t) => {
      const entity = await new db.Field({id: id}).fetch({transacting: t})
      if (!entity) {
        throw errors.NotFoundHttpException()
      }
      const name = entity.get('name')
      await new db.Field({id: id}).destroy({transacting: t})
      const obj = await new db.Object({id: entity.get('object_id')}).fetch({transacting: t})
      const sql = 'alter table obj_' + obj.get('code') + ' drop column ' + name
      await knex.schema.raw(sql)
    }
  },
  list(db) {
    return async (filter: Filter) => {
      const list = await db.Field.query((qb) => {
        const where = filter.where
        //filter
      }).fetchPage({
        pageSize: filter.pageSize,
        page: filter.page
      })
      let result = []
      for (let item of list.models) {
        result.push(await item.toArray())
      }
      return {
        items: result,
        pagination: list.pagination
      }
    }
  },
  fetch(db, errors) {
    return async (id: number) => {
      let entity
      try {
        entity = await new db.Field({id: id}).fetch({require: true})
      } catch(e) {
        if (e instanceof db.Field.NotFoundError) {
          throw errors.NotFoundHttpException()
        }
        throw e
      }
      return await entity.toArray()
    }
  }
}