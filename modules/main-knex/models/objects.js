
import type {Filter} from './../tables'
import type {ObjectEntity} from '../tables/objects'
const moment = require('moment')
const uuid = require('node-uuid')

export default {
  create(db, errors, knex) {
    return async (data: ObjectEntity, t) => {
      const now = moment().toISOString()
      const entity = new db.Object()
      await entity.save({
        created_at: now,
        updated_at: now,
        uuid: uuid.v4(),
        ...data
      }, {transacting: t})
      await knex.schema.createTableIfNotExists('obj_' + data.code, (table) => {
        table.increments()
        table.timestamps()
        table.uuid('uuid').unique()
      })
      return await entity.toArray()
    }
  },
  update(db, errors, knex) {
    return async (id: number, data: ObjectEntity, t) => {
      const now = moment().toISOString()
      const old = await new db.Object({id: id}).fetch({transacting: t})
      if (!old) {
        throw errors.NotFoundHttpException()
      }
      const entity = await new db.Object({id: id}).save({
        updated_at: now,
        ...data
      }, {transacting: t})
      if (old.get('code') !== entity.get('code')) {
        if (await knex.schema.hasTable('obj_' + entity.get('code'))) {
          throw errors.HttpException('Table already exists')
        }
        await knex.schema.renameTable('obj_' + old.get('code'), 'obj_' + entity.get('code'))
      }
      return await entity.toArray()
    }
  },
  remove(db, errors, knex) {
    return async (id: number, t) => {
      const old = await new db.Object({id: id}).fetch({transacting: t})
      if (!old) {
        throw errors.NotFoundHttpException()
      }
      const code = old.get('code')
      await old.destroy({transacting: t})
      await knex.schema.dropTable('obj_' + code)
    }
  },
  list(db) {
    return async (filter: Filter) => {
      const list = await db.Object.query((qb) => {
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
        entity = await new db.Object({id: id}).fetch({require: true})
      } catch(e) {
        if (e instanceof db.Object.NotFoundError) {
          throw errors.NotFoundHttpException()
        }
        throw e
      }
      return await entity.toArray()
    }
  }
}