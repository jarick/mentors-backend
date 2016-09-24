
const mergeWithDefaultRequest = (ctx, request) => {
  return {
    auth() {
      return true
    },
    send(status, json) {
      ctx.status = status
      ctx.body = json
    },
    validate() {
      return false
    },
    all() {
      return {}
    },
    ...request
  }
}

type ActionRequestType = {
  auth: () => boolean,
  validate: () => false|Object,
  all: () => Object,
  send: (status: number, json: Object) => void
}
export function ActionRequest(ctx, request): ActionRequestType {
  return mergeWithDefaultRequest(ctx, request)
}

type CreateRequestType = {
  auth: () => boolean,
  validate: () => false|Object,
  all: () => Object,
  send: (status:number, json: Object) => void
}
export function CreateRequest(ctx, request): CreateRequestType {
  return mergeWithDefaultRequest(ctx, request)
}

type UpdateRequestType = {
  auth: () => boolean,
  validate: (id: number) => false|Object,
  all: () => Object,
  id: (param: string) => number,
  send: (status:number, json: Object) => void
}
export function UpdateRequest(ctx, request): UpdateRequestType {
  return mergeWithDefaultRequest(ctx, request)
}

type RemoveRequestType = {
  auth: () => boolean,
  id: (param: string) => number,
  send: (status:number, json: Object) => void
}
export function RemoveRequest(ctx, request): RemoveRequestType {
  return mergeWithDefaultRequest(ctx, request)
}

type Filter = {
  where: Object,
  sort: Object,
  page: number,
  pageSize: number
}
type FilterRequestType = {
  auth: () => boolean,
  getFilter: () => Filter,
  send: (json: Object) => void
}
export function FilterRequest(ctx, request): FilterRequestType {
  return mergeWithDefaultRequest(ctx, request)
}

export function FetchRequest(ctx, request) {
  return mergeWithDefaultRequest(ctx, request)
}

type Operation = 'create' | 'update' | 'remove' | 'list' | 'fetch'

export function RestRequest(
  auth: (ctx: any, operation: Operation, id: ?number) => boolean,
  schema: () => Object,
  serialize: (body: Object) => Object
) {
  return {
    create(ctx) {
      const body = ctx.request.body
      return () => CreateRequest(ctx, {
        async auth() {
          return await auth(ctx, 'create')
        },
        async validate() {
          const ajv = ctx.ajv
          const validate = ajv.compile(schema(null))
          const valid = await validate(body)
          return (valid) ? false : validate.errors
        },
        all() {
          return serialize(body);
        },
        send(status, json) {
          ctx.status = status
          ctx.body = json
        }
      })
    },
    update(ctx) {
      const params = ctx.params
      const body = ctx.request.body
      return () => UpdateRequest(ctx, {
        async auth(id) {
          return await auth(ctx, 'update', id)
        },
        async validate(id) {
          const ajv = ctx.ajv
          const validate = ajv.compile(schema(id))
          const valid = await validate(body)
          return (valid) ? false : validate.errors
        },
        id (param: string = 'id'):number {
          return params[param] | 0
        },
        all() {
          return serialize(body);
        },
        send(status, json) {
          ctx.status = status
          ctx.body = json
        }
      })
    },
    remove(ctx) {
      const params = ctx.params
      return () => RemoveRequest(ctx, {
        async auth(id) {
          return await auth(ctx, 'remove', id)
        },
        id (param: string = 'id'): number {
          return params[param] | 0
        },
        send(status, json) {
          ctx.status = status
          ctx.body = json
        }
      })
    },
    list(ctx, pageSize = 25) {
      const query = ctx.query
      return () => FilterRequest(ctx, {
        async auth() {
          return await auth(ctx, 'list')
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
        },
        send(status, json) {
          ctx.status = status
          ctx.body = json
        }
      })
    }
  }
}