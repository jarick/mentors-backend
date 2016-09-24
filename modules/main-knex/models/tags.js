
import type {Filter} from './../tables'
import type {TagEntity} from '../tables/tags'
const moment = require('moment')
const uuid = require('node-uuid')

export default {
  create(db) {
    return async (data: TagEntity) => {
      const now = moment().toISOString()
      let entity
      entity = new db.Tag()
      await entity.save({
        created_at: now,
        updated_at: now,
        uuid: uuid.v4(),
        ...data
      })
      return await entity.toArray()
    }
  },
  update(db, errors) {
    return async (id: number, data: TagEntity) => {
      const now = moment().toISOString()
      let entity
      try {
        entity = await new db.Tag({id: id}).save({
          updated_at: now,
          ...data
        })
      } catch (e) {
        if(e instanceof db.Tag.NoRowsUpdatedError) {
          throw errors.NotFoundHttpException()
        }
        throw e
      }
      return await entity.toArray()
    }
  },
  remove(db, errors) {
    return async (id: number) => {
      try {
        await new db.Tag({id: id}).destroy()
      } catch(e) {
        if (e instanceof db.Tag.NoRowsUpdatedError) {
          throw errors.NotFoundHttpException()
        }
        throw e
      }
    }
  },
  list(db) {
    return async (filter: Filter) => {
      const list = await db.Tag.query((qb) => {
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
        entity = await new db.Tag({id: id}).fetch({require: true})
      } catch(e) {
        if (e instanceof db.Tag.NotFoundError) {
          throw errors.NotFoundHttpException()
        }
        throw e
      }
      return await entity.toArray()
    }
  }
}