
import type {Filter} from './../tables'
const moment = require('moment')
const uuid = require('node-uuid')

const Model = (db, object) => db.bookshelf.Model.extend({
  tableName: 'obj_' + object.code,
  toArray: async function() {
    //check fields
    return this.toJSON()
  }
})
export default {
  create(db, errors, object) {
    return async (data: Object) => {
      const ModelEntity = Model(db, object)
      const now = moment().toISOString()
      const entity = new ModelEntity()
      await entity.save({
        created_at: now,
        updated_at: now,
        uuid: uuid.v4(),
        ...data
      })
      return await entity.toArray()
    }
  },
  update(db, errors, object) {
    return async (id: number, data: Object) => {
      const ModelEntity = Model(db, object)
      const now = moment().toISOString()
      let entity
      try {
        entity = await new ModelEntity({id: id}).save({
          updated_at: now,
          ...data
        })
      } catch (e) {
        if(e instanceof ModelEntity.NoRowsUpdatedError) {
          throw errors.NotFoundHttpException()
        }
        throw e
      }
      return await entity.toArray()
    }
  },
  remove(db, errors, object) {
    return async (id: number) => {
      const ModelEntity = Model(db, object)
      try {
        await new ModelEntity({id: id}).destroy()
      } catch(e) {
        if (e instanceof ModelEntity.NoRowsUpdatedError) {
          throw errors.NotFoundHttpException()
        }
        throw e
      }
    }
  },
  list(db, errors, object, fields) {
    return async (filter: Filter) => {
      const ModelEntity = Model(db, object)
      const list = await ModelEntity.query((qb) => {
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
  }
}