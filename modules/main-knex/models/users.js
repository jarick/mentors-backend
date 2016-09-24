
import type {Filter} from './../tables'
import type {UserEntity} from '../tables/users'
const moment = require('moment')
const uuid = require('node-uuid')

export default {
  create(db) {
    return async (data: UserEntity) => {
      const now = moment().toISOString()
      const entity = new db.User()
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
    return async (id: number, data: UserEntity) => {
      const now = moment().toISOString()
      let entity
      try {
        entity = await new db.User({id: id}).save({
          updated_at: now,
          ...data
        })
      } catch (e) {
        if(e instanceof db.User.NoRowsUpdatedError) {
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
        await new db.User({id: id}).destroy()
      } catch(e) {
        if (e instanceof db.User.NoRowsUpdatedError) {
          throw errors.NotFoundHttpException()
        }
        throw e
      }
    }
  },
  list(db) {
    return async (filter: Filter) => {
      const list = await db.User.query((qb) => {
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
        entity = await new db.User({id: id}).fetch({require: true})
      } catch(e) {
        if (e instanceof db.User.NotFoundError) {
          throw errors.NotFoundHttpException()
        }
        throw e
      }
      return await entity.toArray()
    }
  }
}