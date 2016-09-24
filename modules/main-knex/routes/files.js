
import Router from 'koa-router'
import FileRequest from '../requests/files'
import FileModel from '../models/files'
import {
  FilterAction,
  CreateAction,
  UpdateAction,
  RemoveAction,
  compose,
  WrapMiddleware,
  EventsMiddleware,
  ClearCacheMiddleware,
  RelationsMiddleware,
  ListCacheMiddleware
} from './../../../lib/rest'

export default () => {
  const router = new Router()
  router
    .get('/files', async (ctx) => {
      const request = FileRequest.list(ctx)
      const model = FileModel.list(ctx.db, ctx.errors)
      await FilterAction(request, compose([
        EventsMiddleware(ctx.emitter, 'files.list'),
        ListCacheMiddleware(ctx.redis, 'files'),
        WrapMiddleware(model)
      ]))
    })
    .post('/files', async (ctx) => {
      const request = FileRequest.create(ctx)
      const model = FileModel.create(ctx.db, ctx.errors)
      const relDirs = {table: 'directories', column: 'name'}
      await CreateAction(request, compose([
        EventsMiddleware(ctx.emitter, 'files.create'),
        ClearCacheMiddleware(ctx.redis, 'files'),
        RelationsMiddleware(0, 'directories', relDirs, 'file_id', 'directory_id', 'files_directories', ctx.knex),
        WrapMiddleware(model)
      ]))
    })
    .put('/files/:id', async (ctx) => {
      const request = FileRequest.update(ctx)
      const model = FileModel.update(ctx.db, ctx.errors)
      const relDirs = {table: 'directories', column: 'name'}
      await UpdateAction(request, compose([
        EventsMiddleware(ctx.emitter, 'files.update'),
        ClearCacheMiddleware(ctx.redis, 'files'),
        RelationsMiddleware(1, 'directories', relDirs, 'file_id', 'directory_id', 'files_directories', ctx.knex),
        WrapMiddleware(model)
      ]))
    })
    .delete('/files/:id', async (ctx) => {
      const request = FileRequest.remove(ctx)
      const model = FileModel.remove(ctx.db, ctx.errors)
      await RemoveAction(request, compose([
        EventsMiddleware(ctx.emitter, 'files.remove'),
        ClearCacheMiddleware(ctx.redis, 'files'),
        WrapMiddleware(model)
      ]))
    })

  return router;
}