
import {
  NotFoundHttpException,
  AccessDeniedHttpException,
  BadRequestHttpException,
} from './../errors'

type ActionRequest = {
  auth: () => boolean,
  validate: () => false|Object,
  all: () => Object
}
export async function Action(
  request: () => ActionRequest,
  model,
  db = false
) {
  const req = request()
  if (!await req.auth()) {
    throw AccessDeniedHttpException()
  }
  const errors = await req.validate()
  if (errors) {
    throw BadRequestHttpException(errors)
  }
  let json
  if (db) {
    await db.bookshelf.transaction(async (t) => {
      json = await model(req.all(), t)()
    })
  } else {
    json = await model(req.all())()
  }
  req.send(200, json)
}

type CreateRequest = {
  auth: () => boolean,
  validate: () => false|Object,
  all: () => Object
}
export async function CreateAction(
  request: () => CreateRequest,
  model,
  db = false
) {
  const req = request()
  if (!(await req.auth())) {
    throw AccessDeniedHttpException()
  }
  const errors = await req.validate()
  if (errors) {
    throw BadRequestHttpException(errors)
  }
  let json
  if (db) {
    await db.bookshelf.transaction(async (t) => {
      json = await model(req.all(), t)()
    })
  } else {
    json = await model(req.all())()
  }
  if (!json) {
    throw NotFoundHttpException()
  }
  req.send(200, json)
}

type UpdateRequest = {
  auth: (id: number) => boolean,
  validate: () => false|Object,
  id: (param: string) => number,
  all: () => Object
}
type UpdateModel = (id: number, body: Object) => () => Promise<Object>
export async function UpdateAction(
  request: () => UpdateRequest,
  model: UpdateModel,
  db = false,
  id: ?number = null,
  param: string = 'id'
) {
  const req = request()
  if (id === null) {
    id = req.id(param)
  }
  if (id === 0) {
    throw NotFoundHttpException()
  }
  if (!(await req.auth(id))) {
    throw AccessDeniedHttpException()
  }
  await req.validate(id)
  let json
  if (db) {
    await  db.bookshelf.transaction(async (t) => {
      json = await model(id, req.all(), t)()
    })
  } else {
    json = await model(id, req.all())()
  }
  if (!json) {
    throw NotFoundHttpException()
  }
  req.send(200, json)
}

type RemoveRequest = {
  auth: (id: number) => boolean,
  id: (param: string) => number
}
type RemoveModel = (id: number) => () => void
export async function RemoveAction(
  request: () => RemoveRequest,
  model: RemoveModel,
  db = false,
  id: ?number = null,
  param: string = 'id'
) {
  const req = request()
  if (id === null) {
    id = req.id(param)
  }
  if (!(await req.auth(id))) {
    throw AccessDeniedHttpException()
  }
  if (db) {
    await db.bookshelf.transaction(async (t) => {
      await model(id, t)()
    })
  } else {
    await model(id)()
  }
  req.send(200, {result: 'deleted'})
}

type Filter = {
  pageSize: number,
  page: number
}
type FilterRequest = {
  auth: () => boolean,
  getFilter: () => Filter
}
type FilterModel = (filter: Filter) => () => Promise<Array<Object>>
export async function FilterAction(
  request: () => FilterRequest,
  model: FilterModel,
) {
  const req = request()
  if (!(await req.auth())) {
    throw AccessDeniedHttpException()
  }
  const filter = await req.getFilter()
  let json = await model(filter)()
  req.send(200, json)
}

type FetchRequest = {
  auth: (id: number) => boolean,
  id: (param: string) => number
}
type FetchModel = (id: number) => () => Promise<Object>
export async function FetchAction(
  request: () => FetchRequest,
  model: FetchModel,
  id: ?number = null,
  param: string = 'id'
) {
  const req = request()
  if (id === null) {
    id = req.id(param)
  }
  if (!(await req.auth(id))) {
    throw AccessDeniedHttpException()
  }
  const json = await model(id)()
  if (!json) {
    throw NotFoundHttpException()
  }
  req.send(200, json)
}