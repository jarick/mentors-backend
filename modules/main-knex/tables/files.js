
export type FileEntity = {
  id: ?number,
  created_at: ?DateTime,
  deleted_at: ?DateTime,
  uuid: ?string,
  height: ?number,
  width: ?number,
  file_size: ?number,
  content_type: ?string,
  src: string,
  original_name: ?string,
  description: ?string,
  directories: ?Array<string>
}

export const File = (bookshelf, knex) => bookshelf.Model.extend({
  tableName: 'files',
  toArray: async function () {
    const directories = await knex('directories')
      .leftJoin('files_directories', 'directories.id', 'files_directories.directory_id')
      .where('files_directories.file_id', this.get('id'))
      .select('directories.name as name')
    return {
      id: this.get('id'),
      createdAt: this.get('created_at'),
      deletedAt: this.get('deleted_at'),
      uuid: this.get('uuid'),
      height: this.get('height'),
      width: this.get('width'),
      fileSize: this.get('file_size'),
      contentType: this.get('contentType'),
      src: this.get('src'),
      originalName: this.get('original_name'),
      description: directories.map(item => item.name)
    }
  }
})