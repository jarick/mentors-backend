
import {ActionRequest} from './../../../lib/rest'

export default {
  send(ctx) {
    const body = ctx.request.body
    return () => ActionRequest(ctx, {
      auth() {
        return typeof ctx.user === 'object'
      },
      async validate() {
        const ajv = ctx.ajv
        const validate = ajv.compile({
          "$async": true,
          "required": ["body", "room"],
          "properties": {
            "body": {
              "type": "string"
            },
            "room": {
              "exists": {"table": "rooms", "column": "uuid"}
            }
          }
        })
        try {
          await validate(body)
          return false
        } catch (e) {
          return e.errors
        }
      },
      all() {
        return {
          body: body.body,
          room: body.room
        }
      }
    })
  }
}