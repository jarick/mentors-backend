
import type {Filter} from './../tables'
import type {FileEntity} from '../tables/files'
const moment = require('moment')
const uuid = require('node-uuid')

export default {
  create(db) {
    return async (data: FileEntity) => {
      const now = moment().toISOString()
      const entity = new db.File()
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
    return async (id: number, data: FileEntity) => {
      const now = moment().toISOString()
      let entity
      try {
        entity = await new db.File({id: id}).save({
          updated_at: now,
          ...data
        })
      } catch (e) {
        if(e instanceof db.File.NoRowsUpdatedError) {
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
        await new db.File({id: id}).destroy()
      } catch(e) {
        if (e instanceof db.File.NoRowsUpdatedError) {
          throw errors.NotFoundHttpException()
        }
        throw e
      }
    }
  },
  list(db) {
    return async (filter: Filter) => {
      const list = await db.File.query((qb) => {
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
        entity = await new db.File({id: id}).fetch({require: true})
      } catch(e) {
        if (e instanceof db.File.NotFoundError) {
          throw errors.NotFoundHttpException()
        }
        throw e
      }
      return await entity.toArray()
    }
  }
}