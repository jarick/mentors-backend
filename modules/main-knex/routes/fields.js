
import Router from 'koa-router'
import FieldRequest from '../requests/fields'
import FieldModel from '../models/fields'
import {
  FilterAction,
  CreateAction,
  UpdateAction,
  RemoveAction,
  compose,
  WrapMiddleware,
  EventsMiddleware,
  ClearCacheMiddleware,
  ListCacheMiddleware
} from './../../../lib/rest'

export default () => {
  const router = new Router()

  router
    .get('/fields', async (ctx) => {
      const request = FieldRequest.list(ctx)
      const model = FieldModel.list(ctx.db)
      await FilterAction(request, compose([
        EventsMiddleware(ctx.emitter, 'fields.list'),
        ListCacheMiddleware(ctx.redis, 'fields'),
        WrapMiddleware(model)
      ]))
    })
    .post('/fields', async (ctx) => {
      const request = FieldRequest.create(ctx)
      const model = FieldModel.create(ctx.db, ctx.errors, ctx.knex)
      await CreateAction(request, compose([
        EventsMiddleware(ctx.emitter, 'fields.create'),
        ClearCacheMiddleware(ctx.redis, 'fields'),
        WrapMiddleware(model)
      ]), ctx.db)
    })
    .put('/fields/:id', async (ctx) => {
      const request = FieldRequest.update(ctx)
      const model = FieldModel.update(ctx.db, ctx.errors, ctx.knex)
      await UpdateAction(request, compose([
        EventsMiddleware(ctx.emitter, 'fields.update'),
        ClearCacheMiddleware(ctx.redis, 'fields'),
        WrapMiddleware(model)
      ]), ctx.db)
    })
    .delete('/fields/:id', async (ctx) => {
      const request = FieldRequest.remove(ctx)
      const model = FieldModel.remove(ctx.db, ctx.errors, ctx.knex)
      await RemoveAction(request, compose([
        EventsMiddleware(ctx.emitter, 'fields.remove'),
        ClearCacheMiddleware(ctx.redis, 'fields'),
        WrapMiddleware(model)
      ]), ctx.db)
    })

  return router;
}