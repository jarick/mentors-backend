
import {
  ActionRequest,
  UpdateRequest,
  RemoveRequest,
  FilterRequest
} from './../../../lib/rest'

export default {
  create(ctx) {
    const body = ctx.request.body
    return () => ActionRequest(ctx, {
      auth() {
        return typeof ctx.user === 'object'
      },
      async validate() {
        return false
/*
        const ajv = ctx.ajv
        body.forEach(item => {

        })
        const validate = ajv.compile({
          "required": ["friends"],
          "properties": {
            "friends": {
              "type": "array",
              "items": {
                "type": "string",
                "maxLength": 255
              }
            },
          }
        })
        try {
          await validate(body)
          return false
        } catch (e) {
          return e.errors
        }
*/
      },
      all() {
        return body.map(item => Object({
          name: item.name,
          phone: item.phone
        }))
      }
    })
  },
  update(ctx) {
    const body = ctx.request.body
    return () => UpdateRequest(ctx, {
      async auth(id) {
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
          name: body.name
        }
      }
    })
  },
  remove(ctx) {
    return () => RemoveRequest(ctx, {
      auth() {
        return typeof ctx.user === 'object'
      },
    })
  },
  list(ctx, pageSize = 25) {
    const query = ctx.query
    return () => FilterRequest(ctx, {
      async auth() {
        return typeof ctx.user === 'object'
      },
      async getFilter() {
        let where = {}
        if (query.where) {
          try {
            where = JSON.parse(query.where)
          } catch (e) {}
        }
        let sort = {}
        if (query.sort) {
          try {
            sort = JSON.parse(query.sort)
          } catch (e) {}
        }
        const page = query.page | 0
        return {
          where: where,
          sort: sort,
          page: (page > 0) ? page : 1,
          pageSize: pageSize
        }
      }
    })
  }
}