
import { RestRequest } from './../../../lib/rest'

const serialize = (body) => {
  return {
    name: body.name,
    type: body.type,
    not_null: body.notNull,
    schema: body.schema,
    object: body.object
  }
}

const schema = (id) => {
  return {
    "$async": true,
    "required": [
      "name",
      "type",
      "notNull",
      "schema",
      "object"
    ],
    "properties": {
      "name": {
        "type": "string",
        "maxLength": 255
      },
      "type": {
        "enum": [
          "string",
          "boolean",
          "integer",
          "text",
          "float",
          "date",
          "datetime",
          "time",
          "timestamp"
        ]
      },
      "notNull": {
        "type": "boolean"
      },
      "schema": {
        "type": "string",
        "json": {}
      },
      "object": {
        "type": "string",
        "exists": {"table": "objects", "column": "code"}
      }
    }
  }
}

const auth = (ctx) => typeof ctx.user === 'object' && ctx.user.roles.indexOf('admin') > -1

export default RestRequest(auth, schema, serialize)