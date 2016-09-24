
import Router from 'koa-router'
import RoomRequest from '../requests/rooms'
import RoomModel from '../models/rooms'
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
    .get('/rooms', async (ctx) => {
      const request = RoomRequest.list(ctx)
      const model = RoomModel.list(ctx.db, ctx.errors, ctx.user)
      await FilterAction(request, compose([
        EventsMiddleware(ctx.emitter, 'rooms.list'),
        ListCacheMiddleware(ctx.redis, 'rooms'),
        WrapMiddleware(model)
      ]))
    })
    .post('/rooms', async (ctx) => {
      const request = RoomRequest.create(ctx)
      const model = RoomModel.create(ctx.db, ctx.errors, ctx.user)
      const relRole = { table: "roles", column: "name" }
      const relMember = { table: "users", column: "id" }
      await CreateAction(request, compose([
        EventsMiddleware(ctx.emitter, 'rooms.create'),
        ClearCacheMiddleware(ctx.redis, 'rooms'),
        RelationsMiddleware(0, 'roles', relRole, 'room_id', 'role_id', 'rooms_roles', ctx.knex),
        RelationsMiddleware(0, 'members', relMember, 'room_id', 'user_id', 'rooms_users', ctx.knex),
        WrapMiddleware(model)
      ]))
    })
    .put('/rooms/:id', async (ctx) => {
      const request = RoomRequest.update(ctx)
      const model = RoomModel.update(ctx.db, ctx.errors, ctx.user)
      const relRole = { table: "roles", column: "name" }
      const relMember = { table: "users", column: "id" }
      await UpdateAction(request, compose([
        EventsMiddleware(ctx.emitter, 'rooms.update'),
        ClearCacheMiddleware(ctx.redis, 'rooms'),
        RelationsMiddleware(1, 'roles', relRole, 'room_id', 'role_id', 'rooms_roles', ctx.knex),
        RelationsMiddleware(1, 'members', relMember, 'room_id', 'user_id', 'rooms_users', ctx.knex),
        WrapMiddleware(model)
      ]))
    })
    .delete('/rooms/:id', async (ctx) => {
      const request = RoomRequest.remove(ctx)
      const model = RoomModel.remove(ctx.db, ctx.errors, ctx.user)
      await RemoveAction(request, compose([
        EventsMiddleware(ctx.emitter, 'rooms.remove'),
        ClearCacheMiddleware(ctx.redis, 'rooms'),
        WrapMiddleware(model)
      ]))
    })

  return router;
}