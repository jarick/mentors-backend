
const toJSON = require( 'utils-error-to-json' )

export default (e, ctx) => {
  switch (e.type) {
    case 'access_denied':
      ctx.status = 403
      ctx.body = {
        message: 'Access denied.',
        code: 'access_denied',
      }
      break
    case 'conflict':
      ctx.status = 409
      ctx.body = {
        message: 'Object is locked.',
        code: 'conflict'
      }
      break
    case 'gone':
      ctx.status = 410
      ctx.body = {
        message: 'Object is gone.',
        code: 'gone'
      }
      break
    case 'internal':
      ctx.status = 500
      ctx.body = {
        message: 'Internal error.',
        code: 'internal',
        reason: e.reason
      }
      break
    case 'length_required':
      ctx.status = 411
      ctx.body = {
        message: "Please set `Content-Length` header.",
        code: 'length_required'
      }
      break
    case 'method_not_allowed':
      ctx.status = 405
      ctx.body = {
        message: "Method is not allowed.",
        code: "method_not_allowed",
        allow: e.allow
      }
      break
    case "bad_request":
      ctx.status = 400
      ctx.body = {
        message: "Bad request.",
        code: "bad_request",
        errors: e.errors
      }
      break
    case "not_found":
      ctx.status = 404
      ctx.body = {
        message: "Not found.",
        code: "not_found"
      }
      break
    case 'unauthorized':
      ctx.status = 401
      ctx.body = {
        message: "The request requires user authentication",
        code: "unauthorized"
      }
      break
    default:
      ctx.status = 500
      ctx.body = {
        message: "Unexpected error.",
        code: 'internal',
        reason: toJSON(e)
      }
  }
}