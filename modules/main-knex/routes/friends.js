
import Router from 'koa-router'
import FriendRequest from '../requests/friends'
import FriendModel from '../models/friends'
import {
  FilterAction,
  Action,
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
    .get('/friends', async (ctx) => {
      const request = FriendRequest.list(ctx)
      const model = FriendModel.list(ctx.db, ctx.errors, ctx.user)
      await FilterAction(request, compose([
        EventsMiddleware(ctx.emitter, 'friends.list'),
        ListCacheMiddleware(ctx.redis, 'friends'),
        WrapMiddleware(model)
      ]), ctx.db)
    })
    .post('/friends', async (ctx) => {
      const request = FriendRequest.create(ctx)
      const model = FriendModel.create(ctx.db, ctx.errors, ctx.user, ctx.auth)
      await Action(request, compose([
        EventsMiddleware(ctx.emitter, 'friends.create'),
        ClearCacheMiddleware(ctx.redis, 'friends'),
        WrapMiddleware(model)
      ]), ctx.db)
    })
    .put('/friends/:id', async (ctx) => {
      const request = FriendRequest.update(ctx)
      const model = FriendModel.update(ctx.db, ctx.errors, ctx.user)
      await UpdateAction(request, compose([
        EventsMiddleware(ctx.emitter, 'friends.update'),
        ClearCacheMiddleware(ctx.redis, 'friends'),
        WrapMiddleware(model)
      ]), ctx.db)
    })
    .delete('/friends/:id', async (ctx) => {
      const request = FriendRequest.remove(ctx)
      const model = FriendModel.remove(ctx.db, ctx.errors, ctx.user)
      await RemoveAction(request, compose([
        EventsMiddleware(ctx.emitter, 'friends.remove'),
        ClearCacheMiddleware(ctx.redis, 'friends'),
        WrapMiddleware(model)
      ]), ctx.db)
    })

  return router;
}