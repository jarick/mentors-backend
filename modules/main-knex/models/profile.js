
import type {ProfileEntity, UserEntity} from '../tables/users'
const moment = require('moment')

export default {
  save(db, user: ?UserEntity) {
    return async (data: ProfileEntity) => {
      const now = moment().toISOString()
      const entity = await new db.User({id: user.id}).fetch()
      if (data.last_name) {
        entity.set('last_name', data.last_name)
      }
      if (data.second_name) {
        entity.set('second_name', data.second_name)
      }
      if (data.name) {
        entity.set('name', data.name)
      }
      if (data.avatar) {
        entity.set('avatar', data.avatar)
      }
      await entity.save()
      return {
        user_id: entity.get('id'),
        name: entity.get('name'),
        lastName: entity.get('last_name'),
        secondName: entity.get('second_name'),
        avatar: entity.get('avatar')
      }
    }
  },
  get(user: ?UserEntity) {
    return () => {
      return {
        user_id: user.id,
        name: user.name,
        lastName: user.last_name,
        secondName: user.second_name,
        avatar: user.avatar
      }
    }
  }
}