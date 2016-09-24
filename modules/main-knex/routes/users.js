
import Router from 'koa-router'
import UserRequest from '../requests/users'
import UserModel from '../models/users'
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
    .get('/users', async (ctx) => {
      const request = UserRequest.list(ctx)
      const model = UserModel.list(ctx.db, ctx.errors)
      await FilterAction(request, compose([
        EventsMiddleware(ctx.emitter, 'users.list'),
        ListCacheMiddleware(ctx.redis, 'users'),
        WrapMiddleware(model)
      ]))
    })
    .post('/users', async (ctx) => {
      const request = UserRequest.create(ctx)
      const model = UserModel.create(ctx.db, ctx.errors)
      const relRoles = {table: 'roles', column: 'name'}
      await CreateAction(request, compose([
        EventsMiddleware(ctx.emitter, 'users.create'),
        ClearCacheMiddleware(ctx.redis, 'users'),
        RelationsMiddleware(0, 'roles', relRoles, 'user_id', 'role_id', 'users_roles', ctx.knex),
        WrapMiddleware(model)
      ]))
    })
    .put('/users/:id', async (ctx) => {
      const request = UserRequest.update(ctx)
      const model = UserModel.update(ctx.db, ctx.errors)
      const relRoles = {table: 'roles', column: 'name'}
      await UpdateAction(request, compose([
        EventsMiddleware(ctx.emitter, 'users.update'),
        ClearCacheMiddleware(ctx.redis, 'users'),
        RelationsMiddleware(1, 'roles', relRoles, 'user_id', 'role_id', 'users_roles', ctx.knex),
        WrapMiddleware(model)
      ]))
    })
    .delete('/users/:id', async (ctx) => {
      const request = UserRequest.remove(ctx)
      const model = UserModel.remove(ctx.db, ctx.errors)
      await RemoveAction(request, compose([
        EventsMiddleware(ctx.emitter, 'users.remove'),
        ClearCacheMiddleware(ctx.redis, 'users'),
        WrapMiddleware(model)
      ]))
    })

  return router;
}