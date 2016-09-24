
export type RoleEntity = {
  id: ?number,
  created_at: ?Date,
  deleted_at: ?Date,
  uuid: ?string,
  name: ?string
}

export const Role = (bookshelf, knex) => bookshelf.Model.extend({
  tableName: 'roles',
  toArray: async function() {
    return {
      id: this.get('id'),
      createdAt: this.get('created_at'),
      updatedAt: this.get('updated_at'),
      uuid: this.get('uuid'),
      name: this.get('name')
    }
  }
})