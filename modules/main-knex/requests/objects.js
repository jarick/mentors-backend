
import { RestRequest } from './../../../lib/rest'

const serialize = (body) => {
  return {
    external_id: body.external_id,
    active: body.active,
    code: body.code,
    name: body.name,
    description: body.description,
    acl: body.acl,
    permissions: body.permissions,
    tags: body.tags
  }
}

const schema = (id) => {
  return {
    "$async": true,
    "required": [
      "name",
      "code",
      "acl",
      "permissions"
    ],
    "properties": {
      "external_id": {
        "type": "string",
        "maxLength": 255
      },
      "active": {
        "type": "boolean"
      },
      "code": {
        "type": "string",
        "maxLength": 50,
        "unique": {"table": "objects", "column": "code", "id": id}
      },
      "name": {
        "type": "string",
        "maxLength": 255
      },
      "description": {
        "type": "string"
      },
      "acl": {
        "type": "string",
        "json": {}
      },
      "permissions": {
        "type": "string",
        "json": {}
      },
      "tags": {
        "type": "array",
        "uniqueItems": true,
        "items": {
          "type": "integer",
          "exists": {"table": "tags", "column": "name"}
        }
      }
    }
  }
}

const auth = (ctx) => typeof ctx.user === 'object' && ctx.user.roles.indexOf('admin') > -1

export default RestRequest(auth, schema, serialize)