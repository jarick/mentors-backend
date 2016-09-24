
import { RestRequest } from './../../../lib/rest'

type FieldEntity = {
  id: ?number,
  createdAt: ?Date,
  updatedAt: ?Date,
  uuid: string,
  name: string,
  type: string,
  notNull: boolean,
  schema: Object,
  object: string
}

const serialize = (fields: Array<FieldEntity>) => (body) => {
  let result = {}
  fields.forEach(field => result[field.name] = body[field.name])
  return result
}

const schema = (fields: Array<FieldEntity>) => (id) => {
  let properties = {}
  let required = []
  fields.forEach(field => {
    properties[field.name] = field.schema //.replace('!@!', id)
    if (field.notNull) {
      required.push(field.name)
    }
  })
  let result = {
    "$async": true,
    "required": required,
    "properties": properties,
  }
  if (required.length > 0) {
    result.required = required
  }
  return result
}

const auth = (fields: Array<FieldEntity>) => () => true

export default (fields) => RestRequest(auth(fields), schema(fields), serialize(fields))