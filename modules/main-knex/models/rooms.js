
import type {Filter} from './../tables'
import type {RoomEntity} from '../tables/rooms'
const moment = require('moment')
const uuid = require('node-uuid')

export default {
  create(db, errors, user) {
    return async (data: RoomEntity) => {
      const now = moment().toISOString()
      const entity = new db.Room()
      await entity.save({
        created_at: now,
        updated_at: now,
        uuid: uuid.v4(),
        author: user.id,
        ...data
      })
      return await entity.toArray()
    }
  },
  update(db, errors, user) {
    return async (id: number, data: RoomEntity) => {
      const now = moment().toISOString()
      let entity
      try {
        entity = await new db.Room({id: id}).save({
          updated_at: now,
          ...data
        })
      } catch (e) {
        if(e instanceof db.Room.NoRowsUpdatedError) {
          throw errors.NotFoundHttpException()
        }
        throw e
      }
      return await entity.toArray()
    }
  },
  remove(db, errors, user) {
    return async (id: number) => {
      try {
        await new db.Room({id: id}).destroy()
      } catch(e) {
        if (e instanceof db.Room.NoRowsUpdatedError) {
          throw errors.NotFoundHttpException()
        }
        throw e
      }
    }
  },
  list(db, errors, user) {
    return async (filter: Filter) => {
      const list = await db.Room.query((qb) => {
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
  fetch(db, errors, user) {
    return async (id: number) => {
      let entity
      try {
        entity = await new db.Room({id: id}).fetch({require: true})
      } catch(e) {
        if (e instanceof db.Room.NotFoundError) {
          throw errors.NotFoundHttpException()
        }
        throw e
      }
      return await entity.toArray()
    }
  }
}