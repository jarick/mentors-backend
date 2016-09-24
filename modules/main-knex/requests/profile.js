
import {ActionRequest} from './../../../lib/rest'

export default {
  save(ctx) {
    const body = ctx.request.body
    return () => ActionRequest(ctx, {
      auth() {
        return typeof ctx.user === 'object'
      },
      async validate() {
        const ajv = ctx.ajv
        const validate = ajv.compile({
          "properties": {
            "name": {
              "type": "string",
              "maxLength": 255
            },
            "avatar": {
              "type": "string",
              "maxLength": 255
            },
            "lastName": {
              "type": "string",
              "maxLength": 255
            },
            "secondName": {
              "type": "string",
              "maxLength": 255
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
          name: body.name,
          last_name: body.lastName,
          second_name: body.secondName
        }
      }
    })
  },
  get(ctx) {
    return () => ActionRequest(ctx, {
      auth() {
        return typeof ctx.user === 'object'
      }
    })
  }
}