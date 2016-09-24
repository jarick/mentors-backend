
export type UserEntity = {
  id: ?number,
  created_at: ?Date,
  deleted_at: ?Date,
  uuid: ?string,
  login: string,
  active: ?boolean,
  name: ?string,
  last_name: ?string,
  second_name: ?string,
  external_auth_id: ?string,
  state: ?string | ?Object,
  adminNotes: ?string,
  avatar: ?string,
  roles: ?Array<string>
}

export type ProfileEntity = {
  state: ?string,
  name: ?string,
  last_name: ?string,
  second_name: ?string,
  avatar: ?string
}

export const User = (bookshelf, knex) => bookshelf.Model.extend({
  tableName: 'users',
  toArray: async function() {
    const roles = await knex('roles')
      .leftJoin('users_roles', 'roles.id', 'users_roles.role_id')
      .where({"users_roles.user_id": this.get('id')})
      .select('roles.name as name')
    return {
      id: this.get('id'),
      createdAt: this.get('created_at'),
      deletedAt: this.get('deleted_at'),
      uuid: this.get('uuid'),
      login: this.get('login'),
      active: this.get('active') > 0,
      name: this.get('name'),
      lastName: this.get('last_name'),
      secondName: this.get('second_name'),
      externalAuthId: this.get('external_auth_id'),
      state: JSON.parse(this.get('state')),
      avatar: this.get('avatar'),
      adminNotes: this.get('admin_notes'),
      roles: roles.map(item => item.name)
    }
  }
})
