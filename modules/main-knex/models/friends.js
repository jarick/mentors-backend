

import type {Filter} from './../tables'
import type {FriendEntity} from '../tables/friends'
const moment = require('moment')
const uuid = require('node-uuid')
const libphonenumber = require('google-libphonenumber')

export default {
  create(db, errors, user, auth) {
    const savedAuth = auth
    return async (data: Array<FriendEntity>, t) => {
      const now = moment().toISOString()
      const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
      const PNF = libphonenumber.PhoneNumberFormat;
      let result = []
      for(let item of data) {
        let phoneNumber
        try {
          phoneNumber = phoneUtil.parse(item.phone, savedAuth.country);
        } catch (e) {
          continue
        }
        if (!phoneUtil.isValidNumber(phoneNumber)) {
          continue
        }
        const auth = await new db.AuthSms({
          phone: phoneUtil.format(phoneNumber, PNF.E164)
        }).fetch({transacting: t})
        if (auth) {
          if (auth.get('id') == savedAuth.id) {
            continue
          }
          const find = await db.Friend.where({
            user_id: user.id,
            profile: auth.get('user_id')
          }).fetch()
          if (!find) {
            const saved = new db.Friend()
            await saved.save({
              created_at: now,
              updated_at: now,
              uuid: uuid.v4(),
              user_id: user.id,
              profile: auth.get('user_id'),
              name: item.name
            }, {transacting: t})
            result.push(await saved.toArray())
          }
        } else {
          result.push(null)
        }
      }
      return result
    }
  },
  update(db, errors, user) {
    return async (id: number, data: FriendEntity, t) => {
      const now = moment().toISOString()
      let entity
      try {
        entity = await new db.Friend({
          id: id
        }).save({
          updated_at: now,
          ...data
        }, {transacting: t})
      } catch (e) {
        if(e instanceof db.Friend.NoRowsUpdatedError) {
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
        await new db.Friend({
          id: id,
          user_id: user.id
        }).destroy()
      } catch(e) {
        if (e instanceof db.Friend.NoRowsUpdatedError) {
          throw errors.NotFoundHttpException()
        }
        throw e
      }
    }
  },
  list(db, errors, user) {
    return async (filter: Filter) => {
      const list = await db.Friend.query((qb) => {
        qb.where('user_id', user.id)
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
        entity = await new db.Friend({
          id: id,
          user_id: user
        }).fetch({require: true})
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