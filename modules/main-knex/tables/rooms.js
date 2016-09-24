
export type RoomEntity = {
  id: ?number,
  created_at: ?DateTime,
  deleted_at: ?DateTime,
  uuid: ?string,
  active: ?boolean,
  type: string,
  name: string,
  roles: ?Array<number>,
  members: ?Array<number>
}

export const Room = (bookshelf, knex) => bookshelf.Model.extend({
  tableName: 'rooms',
  toArray: async function() {
    const roles = await knex('roles')
      .leftJoin('rooms_roles', 'roles.id', 'rooms_roles.room_id')
      .where({"rooms_roles.room_id": this.get('id')})
      .select('roles.name as name')
    const members = await knex('rooms_users')
      .where({"rooms_users.room_id": this.get('id')})
      .select('rooms_users.user_id as id')
    return {
      id: this.get('id'),
      createdAt: this.get('created_at'),
      deletedAt: this.get('deleted_at'),
      uuid: this.get('uuid'),
      author: this.get('author'),
      active: this.get('active'),
      type: this.get('type'),
      name: this.get('name'),
      roles: roles.map(item => item.name),
      members: members.map(item => item.id)
    }
  }
})