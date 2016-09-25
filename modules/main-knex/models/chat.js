
export default {
  send(knex, errors, redis, events, user) {
    return async(data) => {
      const list = await knex('rooms_users')
        .leftJoin('rooms', 'rooms_users.room_id', 'rooms.id')
        .where({uuid: data.room})
        .select('user_id')
      for (let item of list) {
        // if (item.user_id != user.id) {
          redis.publish('chat_' + item.user_id, data.body)
        //}
      }
      return {
        result: 'ok'
      }
    }
  },
}