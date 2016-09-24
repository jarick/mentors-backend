
import Router from 'koa-router'
import ObjectRequest from '../requests/objects'
import ObjectModel from '../models/objects'
import {
  FilterAction,
  CreateAction,
  UpdateAction,
  RemoveAction,
  compose,
  WrapMiddleware,
  EventsMiddleware,
  ClearCacheMiddleware,
  ListCacheMiddleware,
  RelationsMiddleware
} from './../../../lib/rest'

export default () => {
  const router = new Router()

  router
    .get('/objects', async (ctx) => {
      const request = ObjectRequest.list(ctx)
      const model = ObjectModel.list(ctx.db)
      await FilterAction(request, compose([
        EventsMiddleware(ctx.emitter, 'objects.list'),
        ListCacheMiddleware(ctx.redis, 'objects'),
        WrapMiddleware(model)
      ]), ctx.db)
    })
    .post('/objects', async (ctx) => {
      const request = ObjectRequest.create(ctx)
      const model = ObjectModel.create(ctx.db, ctx.errors, ctx.knex)
      const relTags = {table: 'tags', column: 'name'}
      await CreateAction(request, compose([
        EventsMiddleware(ctx.emitter, 'objects.create'),
        ClearCacheMiddleware(ctx.redis, 'objects'),
        RelationsMiddleware(0, 'tags', relTags, 'object_id', 'tag_id', 'objects_tags', ctx.knex),
        WrapMiddleware(model)
      ]), ctx.db)
    })
    .put('/objects/:id', async (ctx) => {
      const request = ObjectRequest.update(ctx)
      const model = ObjectModel.update(ctx.db, ctx.errors, ctx.knex)
      const relTags = {table: 'tags', column: 'name'}
      await UpdateAction(request, compose([
        EventsMiddleware(ctx.emitter, 'objects.update'),
        ClearCacheMiddleware(ctx.redis, 'objects'),
        RelationsMiddleware(1, 'tags', relTags, 'object_id', 'tag_id', 'objects_tags', ctx.knex),
        WrapMiddleware(model)
      ]), ctx.db)
    })
    .delete('/objects/:id', async (ctx) => {
      const request = ObjectRequest.remove(ctx)
      const model = ObjectModel.remove(ctx.db, ctx.errors, ctx.knex)
      await RemoveAction(request, compose([
        EventsMiddleware(ctx.emitter, 'objects.remove'),
        ClearCacheMiddleware(ctx.redis, 'objects'),
        WrapMiddleware(model)
      ]), ctx.db)
    })

  return router;
}