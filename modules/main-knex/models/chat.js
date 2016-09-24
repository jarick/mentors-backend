
export default {
  send(knex, errors, rsmq, events) {
    return async(data) => {
      const list = await knex('rooms_users')
        .leftJoin('rooms', 'rooms_users.room_id', 'rooms.id')
        .where({uuid: data.room})
        .select('user_id')
      for (let item of list) {
        rsmq.sendMessage({qname: 'chat_' + item.user_id, message: data.body})
      }
      return {
        result: 'ok'
      }
    }
  },
}