
import Router from 'koa-router'
import TagRequest from '../requests/tags'
import TagModel from '../models/tags'
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
    .get('/tags', async (ctx) => {
      const request = TagRequest.list(ctx)
      const model = TagModel.list(ctx.db, ctx.errors)
      await FilterAction(request, compose([
        EventsMiddleware(ctx.emitter, 'tags.list'),
        ListCacheMiddleware(ctx.redis, 'tags'),
        WrapMiddleware(model)
      ]))
    })
    .post('/tags', async (ctx) => {
      const request = TagRequest.create(ctx)
      const model = TagModel.create(ctx.db, ctx.errors)
      await CreateAction(request, compose([
        EventsMiddleware(ctx.emitter, 'tags.create'),
        ClearCacheMiddleware(ctx.redis, 'tags'),
        WrapMiddleware(model)
      ]))
    })
    .put('/tags/:id', async (ctx) => {
      const request = TagRequest.update(ctx)
      const model = TagModel.update(ctx.db, ctx.errors)
      await UpdateAction(request, compose([
        EventsMiddleware(ctx.emitter, 'tags.update'),
        ClearCacheMiddleware(ctx.redis, 'tags'),
        WrapMiddleware(model)
      ]))
    })
    .delete('/tags/:id', async (ctx) => {
      const request = TagRequest.remove(ctx)
      const model = TagModel.remove(ctx.db, ctx.errors)
      await RemoveAction(request, compose([
        EventsMiddleware(ctx.emitter, 'tags.remove'),
        ClearCacheMiddleware(ctx.redis, 'tags'),
        WrapMiddleware(model)
      ]))
    })

  return router;
}