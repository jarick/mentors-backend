
import Router from 'koa-router'
import ItemRequest from '../requests/items'
import ItemModel from '../models/items'
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
    .get('/:item', async (ctx, next) => {
      const object = ctx.params.item
      const find = await ctx.db.Object.where({code: object}).fetch()
      if (!find) {
        await next()
      } else {
        let fields = await ctx.db.Field.where({object_id: find.id}).fetchAll()
        let fieldsSerialize = []
        for(let item of fields.models) {
          fieldsSerialize.push(await item.toArray())
        }
        const request = ItemRequest(fieldsSerialize).list(ctx)
        const model = ItemModel.list(ctx.db, ctx.errors, await find.toArray(), fieldsSerialize)
        await FilterAction(request, compose([
          EventsMiddleware(ctx.emitter, 'items.' + object + '.list'),
          ListCacheMiddleware(ctx.redis, 'items.' + object),
          WrapMiddleware(model)
        ]))
      }
    })
    .post('/:item', async (ctx, next) => {
      const object = ctx.params.item
      const find = await ctx.db.Object.where({code: object}).fetch()
      if (!find) {
        await next()
      } else {
        let fields = await ctx.db.Field.where({object_id: find.id}).fetchAll()
        let fieldsSerialize = []
        for(let item of fields.models) {
          fieldsSerialize.push(await item.toArray())
        }
        const request = ItemRequest(fieldsSerialize).create(ctx)
        const model = ItemModel.create(ctx.db, ctx.errors, await find.toArray(), fieldsSerialize)
        await CreateAction(request, compose([
          EventsMiddleware(ctx.emitter, 'items.' + object + '.create'),
          ClearCacheMiddleware(ctx.redis, 'items.' + object),
          WrapMiddleware(model)
        ]))
      }
    })
    .put('/:item/:id', async (ctx, next) => {
      const object = ctx.params.item
      const find = await ctx.db.Object.where({code: object}).fetch()
      if (!find) {
        await next()
      } else {
        let fields = await ctx.db.Field.where({object_id: find.id}).fetchAll()
        let fieldsSerialize = []
        for(let item of fields.models) {
          fieldsSerialize.push(await item.toArray())
        }
        const request = ItemRequest(fieldsSerialize).update(ctx)
        const model = ItemModel.update(ctx.db, ctx.errors, await find.toArray(), fieldsSerialize)
        await UpdateAction(request, compose([
          EventsMiddleware(ctx.emitter, 'items.' + object + '.update'),
          ClearCacheMiddleware(ctx.redis, 'items.' + object),
          WrapMiddleware(model)
        ]))
      }
    })
    .delete('/:item/:id', async (ctx, next) => {
      const object = ctx.params.item
      const find = await ctx.db.Object.where({code: object}).fetch()
      if (!find) {
        await next()
      } else {
        let fields = await ctx.db.Field.where({object_id: find.id}).fetchAll()
        let fieldsSerialize = []
        for(let item of fields.models) {
          fieldsSerialize.push(await item.toArray())
        }
        const request = ItemRequest(fieldsSerialize).remove(ctx)
        const model = ItemModel.remove(ctx.db, ctx.errors, await find.toArray(), fieldsSerialize)
        await RemoveAction(request, compose([
          EventsMiddleware(ctx.emitter, 'items.' + object + '.remove'),
          ClearCacheMiddleware(ctx.redis, 'items.' + object),
          WrapMiddleware(model)
        ]))
      }
    })

  return router;
}