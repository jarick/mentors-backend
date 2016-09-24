const Ajv = require('ajv')

export default function (knex) {
  const ajv = new Ajv

  ajv.addKeyword('unique', {
    async: true,
    type: 'string',
    validate: async (schema, data) => {
      let where = {}
      where[schema.column] = data
      if (typeof schema.with === 'object') {
        for (let column in schema.with) {
          if (schema.with.hasOwnProperty(column)) {
            where[column] = schema.with[column]
          }
        }
      }
      const qb = knex.select().from(schema.table).where(where)
      if (schema.id > 0) {
        qb.andWhere('id', '<>', schema.id)
      }
      const rows = await qb.count('id as count')
      if (rows[0].count > 0) {
        throw new Ajv.ValidationError([{
          keyword: 'unique',
          params: { notUniqueProperty: schema.column },
          message: 'Value is not unique'
        }])
      }
      return true
    }
  });

  ajv.addKeyword('existsId', {
    async: true,
    type: 'integer',
    validate: async (schema, data) => {
      const qb = knex.select().from(schema.table).where({id: data})
      const rows = await qb.count('id as count')
      if (rows[0].count === 0) {
        throw new Ajv.ValidationError([{
          keyword: 'existsId',
          params: { notExistsId: schema.table },
          message: 'Relation object is not exists'
        }])
      }
      return true
    }
  });

  ajv.addKeyword('json', {
    type: 'string',
    validate: (schema, data) => {
      if (typeof data === 'string') {
        try {
          JSON.parse(data)
        } catch(e) {
          throw new Ajv.ValidationError([{
            keyword: 'json',
            params: { notJson: data },
            message: 'Value is not json'
          }])
        }
      }
      return true
    }
  });

  ajv.addKeyword('exists', {
    async: true,
    type: 'string',
    validate: async (schema, data) => {
      let where = {}
      where[schema.column] = data
      const qb = knex.select().from(schema.table).where(where)
      const rows = await qb.count('id as count')
      if (rows[0].count === 0) {
        throw new Ajv.ValidationError([{
          keyword: 'exists',
          params: { notExists: schema.column },
          message: 'Value is not exists in database'
        }])
      }
      return true
    }
  });

  const validateExists = (name, table, code, message) => {
    ajv.addKeyword(name, {
      async: true,
      type: 'integer',
      validate: async (schema, data) => {
        const qb = knex.select().from(table).where({id: data})
        const rows = await qb.count('id as count')
        if (rows[0].count === 0) {
          throw new Ajv.ValidationError([{
            keyword: code,
            params: { notExistsId: schema.table },
            message: message
          }])
        }
        return true
      }
    });
  }

  validateExists('user', 'users', 'existsUser', 'User is not exists')
  validateExists('role', 'roles', 'existsRole', 'Role is not exists')
  validateExists('file', 'files', 'existsFile', 'File is not exists')
  validateExists('directory', 'directories', 'existsDirectory', 'Directory is not exists')
  validateExists('object', 'objects', 'existsObject', 'Object is not exists')
  validateExists('tag', 'tags', 'existsTag', 'Tag is not exists')

  return ajv
}