
import Router from 'koa-router'
import DirectoryRequest from '../requests/directories'
import DirectoryModel from '../models/directories'
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
    .get('/directories', async (ctx) => {
      const request = DirectoryRequest.list(ctx)
      const model = DirectoryModel.list(ctx.db, ctx.errors)
      await FilterAction(request, compose([
        EventsMiddleware(ctx.emitter, 'directories.list'),
        ListCacheMiddleware(ctx.redis, 'directories'),
        WrapMiddleware(model)
      ]))
    })
    .post('/directories', async (ctx) => {
      const request = DirectoryRequest.create(ctx)
      const model = DirectoryModel.create(ctx.db, ctx.errors)
      await CreateAction(request, compose([
        EventsMiddleware(ctx.emitter, 'directories.create'),
        ClearCacheMiddleware(ctx.redis, 'directories'),
        WrapMiddleware(model)
      ]))
    })
    .put('/directories/:id', async (ctx) => {
      const request = DirectoryRequest.update(ctx)
      const model = DirectoryModel.update(ctx.db, ctx.errors)
      await UpdateAction(request, compose([
        EventsMiddleware(ctx.emitter, 'directories.update'),
        ClearCacheMiddleware(ctx.redis, 'directories'),
        WrapMiddleware(model)
      ]))
    })
    .delete('/directories/:id', async (ctx) => {
      const request = DirectoryRequest.remove(ctx)
      const model = DirectoryModel.remove(ctx.db, ctx.errors)
      await RemoveAction(request, compose([
        EventsMiddleware(ctx.emitter, 'directories.remove'),
        ClearCacheMiddleware(ctx.redis, 'directories'),
        WrapMiddleware(model)
      ]))
    })

  return router;
}