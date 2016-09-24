
export type FieldEntity = {
  id: ?number,
  created_at: ?DateTime,
  updated_at: ?DateTime,
  uuid: ?string,
  name: string,
  type: string,
  not_null: boolean,
  schema: string,
  object: string,
}

export const Field = (bookshelf, knex) => bookshelf.Model.extend({
  tableName: 'fields',
  toArray: async function() {
    const json = (data) => (typeof data === 'object') ? data : JSON.parse(data)
    const obj = await knex('objects').where({id: this.get('object_id')}).first('code')
    return {
      id: this.get('id'),
      createdAt: this.get('created_at'),
      updatedAt: this.get('updated_at'),
      uuid: this.get('uuid'),
      name: this.get('name'),
      type: this.get('type'),
      notNull: this.get('not_null') > 0,
      schema: json(this.get('schema')),
      object: obj.code
    }
  }
})