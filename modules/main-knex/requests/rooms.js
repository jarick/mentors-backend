
import { RestRequest } from './../../../lib/rest'

const serialize = (body) => {
  return {
    active: body.active,
    type: body.type,
    name: body.name,
    members: body.members || [],
    roles: body.roles || []
  }
}

const schema = (id) => {
  return {
    "$async": true,
    "required": [
      "type",
      "name"
    ],
    "properties": {
      "active": {
        "type": "boolean"
      },
      "type": {
        "enum": ["public", "private"]
      },
      "name": {
        "type": "string",
        "maxLength": 255
      },
      "roles": {
        "type": "array",
        "uniqueItems": true,
        "items": {
          "type": "integer",
          "existsId": {table: "roles"}
        }
      },
      "members": {
        "type": "array",
        "uniqueItems": true,
        "items": {
          "type": "integer",
          "existsId": {table: "users"}
        }
      }
    }
  }
}

const auth = (ctx) => typeof ctx.user === 'object'

export default RestRequest(auth, schema, serialize)