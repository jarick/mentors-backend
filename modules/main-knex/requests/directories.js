
import { RestRequest } from './../../../lib/rest'

const serialize = (body) => {
  return {
    name: body.name,
  }
}

const schema = (id) => {
  return {
    "$async": true,
    "required": ["name"],
    "properties": {
      "name": {
        "type": "string",
        "maxLength": 255,
        "unique": {"table": "directories", "column": "name", "id": id}
      }
    }
  }
}

const auth = (ctx) => typeof ctx.user === 'object' && ctx.user.roles.indexOf('admin') > -1

export default RestRequest(auth, schema, serialize)