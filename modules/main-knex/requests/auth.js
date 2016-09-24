
import {ActionRequest} from './../../../lib/rest'

export default {
  sendEmail(ctx) {
    const body = ctx.request.body
    return () => ActionRequest(ctx, {
      auth() {
        return !ctx.user
      },
      async validate() {
        const ajv = ctx.ajv
        const validate = ajv.compile({
          "$async": true,
          "required": ["mail"],
          "properties": {
            "mail": {
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
          mail: body.mail
        }
      }
    })
  },
  verifyEmail(ctx) {
    const body = ctx.request.body
    return () => ActionRequest(ctx, {
      auth() {
        return !ctx.user
      },
      async validate() {
        const ajv = ctx.ajv
        const validate = ajv.compile({
          "$async": true,
          "required": ["id", "checkword", "password"],
          "properties": {
            "id": {
              "type": "integer",
              "existsId": {"table": "users_auth_mail"}
            },
            "checkword": {
              "type": "string",
              "maxLength": 255
            },
            "password": {
              "type": "string",
              "maxLength": 30,
              "minLength": 6
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
          id: body.id,
          checkword: body.checkword,
          password: body.password
        }
      }
    })
  },
  resetEmail(ctx) {
    const body = ctx.request.body
    return () => ActionRequest(ctx, {
      auth() {
        return !ctx.user
      },
      async validate() {
        const ajv = ctx.ajv
        const validate = ajv.compile({
          "$async": true,
          "required": ["mail"],
          "properties": {
            "mail": {
              "type": "string",
              "exists": {"table": "users_auth_mail", "column": "mail"}
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
          mail: body.mail,
        }
      }
    })
  },
  confirmEmail(ctx) {
    const body = ctx.request.body
    return () => ActionRequest(ctx, {
      auth() {
        return !ctx.user
      },
      async validate() {
        const ajv = ctx.ajv
        const validate = ajv.compile({
          "$async": true,
          "required": ["id", "checkword"],
          "properties": {
            "id": {
              "type": "integer",
              "existsId": {"table": "users_auth_mail"}
            },
            "checkword": {
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
          user_id: body.userId,
          checkword: body.checkword
        }
      }
    })
  },
  sendSms(ctx) {
    let body = ctx.request.body
    return () => ActionRequest(ctx, {
      auth() {
        return !ctx.user
      },
      async validate() {
        const ajv = ctx.ajv
        const validate = ajv.compile({
          "$async": true,
          "required": ["phone", "country", "deviceId", "deviceType"],
          "properties": {
            "phone": {
              "type": "string",
              "maxLength": 255
            },
            "country": {
              "type": "string",
              "maxLength": 2
            },
            "pushToken": {
              "type": "string",
              "maxLength": 255
            },
            "deviceId": {
              "type": "string",
              "maxLength": 255
            },
            "deviceType": {
              "enum": ["web", "android", "ios"]
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
          phone: body.phone,
          country: body.country,
          push_token: body.pushToken ? body.pushToken : null,
          device_id: body.deviceId,
          device_type: body.deviceType
        }
      }
    })
  },
  verifySms(ctx) {
    let body = ctx.request.body
    return () => ActionRequest(ctx, {
      auth() {
        return !ctx.user
      },
      async validate() {
        const ajv = ctx.ajv
        const validate = ajv.compile({
          "$async": true,
          "required": ["id", "code"],
          "properties": {
            "id": {
              "type": "integer",
              "existsId": {"table": "users_auth_sms"}
            },
            "code": {
              "type": "string",
              "maxLength": 50
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
          id: body.id,
          code: body.code
        }
      }
    })
  },
  loginEmail(ctx) {
    const body = ctx.request.body
    return () => ActionRequest(ctx, {
      auth() {
        return !ctx.user
      },
      async validate() {
        const ajv = ctx.ajv
        const validate = ajv.compile({
          "$async": true,
          "required": ["mail", "password"],
          "properties": {
            "mail": {
              "type": "string",
              "maxLength": 50
            },
            "password": {
              "type": "string",
              "maxLength": 30,
              "minLength": 6
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
          mail: body.mail,
          password: body.password
        }
      }
    })
  }
}