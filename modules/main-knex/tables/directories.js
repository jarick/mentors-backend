
export type DirectoryEntity = {
  id: ?number,
  created_at: ?DateTime,
  deleted_at: ?DateTime,
  uuid: ?string,
  name: ?string,
}

export const Directory = (bookshelf) => bookshelf.Model.extend({
  tableName: 'directories',
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