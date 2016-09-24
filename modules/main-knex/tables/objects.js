
export type ObjectEntity = {
  id: ?number,
  created_at: ?DateTime,
  deleted_at: ?DateTime,
  uuid: ?string,
  external_id: ?string,
  active: ?boolean,
  code: string,
  name: string,
  description: ?string,
  acl: string|Object,
  permissions: string|Object,
  tags: ?Array<number>
}

export const ObjectTable = (bookshelf, knex) => bookshelf.Model.extend({
  tableName: 'objects',
  toArray: async function () {
    const json = (data) => (typeof data === 'object') ? data : JSON.parse(data)
    const tags = await knex('tags')
      .leftJoin('objects_tags', 'tags.id', 'objects_tags.tag_id')
      .where({"objects_tags.object_id": this.get('id')})
      .select('tags.name as name')
    return {
      id: this.get('id'),
      createdAt: this.get('created_at'),
      deletedAt: this.get('deleted_at'),
      uuid: this.get('uuid'),
      externalId: this.get('external_id'),
      active: this.get('active'),
      code: this.get('code'),
      name: this.get('name'),
      description: this.get('description'),
      acl: json(this.get('acl')),
      permissions: json(this.get('permissions')),
      tags: tags.map(item => item.name)
    }
  }
})
