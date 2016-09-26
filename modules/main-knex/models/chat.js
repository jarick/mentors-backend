
export default {
  send(knex, errors, amqp, events, user) {
    return async(data) => {
      const pub = amqp.socket('PUB')
      const list = await knex('rooms_users')
        .leftJoin('rooms', 'rooms_users.room_id', 'rooms.id')
        .where({uuid: data.room})
        .select('user_id')
      for (let item of list) {
        await new Promise((resolve) => {
          pub.connect('chat_' + item.user_id, () => {
            pub.write(JSON.stringify(data.body), 'utf-8')
            resolve()
          })
        })
      }
      pub.close()
      return {
        result: 'ok'
      }
    }
  },
}