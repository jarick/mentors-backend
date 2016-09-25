
export default {
  send(knex, errors, amqp, events, user) {
    return async(data) => {
      const list = await knex('rooms_users')
        .leftJoin('rooms', 'rooms_users.room_id', 'rooms.id')
        .where({uuid: data.room})
        .select('user_id')
      for (let item of list) {
        const qname = 'chat_' + item.user_id
        amqp.exchange(qname, (exchange) => {
          exchange.publish('message', data.body)
        })
        // if (item.user_id != user.id) {
          //redis.publish('chat_' + item.user_id, data.body)
        //}
      }
      return {
        result: 'ok'
      }
    }
  },
}