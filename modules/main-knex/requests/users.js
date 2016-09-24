
import { RestRequest } from './../../../lib/rest'

const serialize = (body) => {
  return {
    login: body.login,
    active: body.active,
    name: body.name,
    last_name: body.last_name,
    second_name: body.second_name,
    external_auth_id: body.external_auth_id,
    roles: body.roles,
    admin_notes: body.adminNotes,
    state: body.state,
    avatar: body.avatar
  }
}

const schema = (id) => {
  return {
    "$async": true,
    "required": ["login", "state"],
    "properties": {
      "login": {
        "type": "string",
        "maxLength": 50,
        "unique": {"table": "users", "column": "login", "id": id}
      },
      "active": {
        "type": "boolean"
      },
      "name": {
        "type": "string",
        "maxLength": 255
      },
      "last_name": {
        "type": "string",
        "maxLength": 255
      },
      "second_name": {
        "type": "string",
        "maxLength": 255
      },
      "external_auth_id": {
        "type": "string",
        "maxLength": 255
      },
      "state": {
        "type": "string",
        "json": {}
      },
      "avatar": {
        "type": "string",
        "maxLength": 255
      },
      "admin_notes": {
        "type": "string",
      },
      "roles": {
        "type": "array",
        "uniqueItems": true,
        "items": {
          "type": "string",
          "exists": {"table": "roles", "column": "name"}
        }
      }
    }
  }
}

const auth = (ctx) => typeof ctx.user === 'object' && ctx.user.roles.indexOf('admin') > -1

export default RestRequest(auth, schema, serialize)