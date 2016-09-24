
import Router from 'koa-router'
import RoleRequest from '../requests/roles'
import RoleModel from '../models/roles'
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
    .get('/roles', async (ctx) => {
      const request = RoleRequest.list(ctx)
      const model = RoleModel.list(ctx.db, ctx.errors)
      await FilterAction(request, compose([
        EventsMiddleware(ctx.emitter, 'roles.list'),
        ListCacheMiddleware(ctx.redis, 'roles'),
        WrapMiddleware(model)
      ]))
    })
    .post('/roles', async (ctx) => {
      const request = RoleRequest.create(ctx)
      const model = RoleModel.create(ctx.db, ctx.errors)
      await CreateAction(request, compose([
        EventsMiddleware(ctx.emitter, 'roles.create'),
        ClearCacheMiddleware(ctx.redis, 'roles'),
        WrapMiddleware(model)
      ]))
    })
    .put('/roles/:id', async (ctx) => {
      const request = RoleRequest.update(ctx)
      const model = RoleModel.update(ctx.db, ctx.errors)
      await UpdateAction(request, compose([
        EventsMiddleware(ctx.emitter, 'roles.update'),
        ClearCacheMiddleware(ctx.redis, 'roles'),
        WrapMiddleware(model)
      ]))
    })
    .delete('/roles/:id', async (ctx) => {
      const request = RoleRequest.remove(ctx)
      const model = RoleModel.remove(ctx.db, ctx.errors)
      await RemoveAction(request, compose([
        EventsMiddleware(ctx.emitter, 'roles.remove'),
        ClearCacheMiddleware(ctx.redis, 'roles'),
        WrapMiddleware(model)
      ]))
    })

  return router;
}