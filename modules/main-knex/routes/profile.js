
import Router from 'koa-router'
import ProfileRequest from '../requests/profile'
import ProfileModel from '../models/profile'
import {
  Action,
  compose,
  WrapMiddleware
} from './../../../lib/rest'

export default () => {
  const router = new Router()

  router
    .post('/profile', async(ctx) => {
      const request = ProfileRequest.save(ctx)
      const model = ProfileModel.save(ctx.db, ctx.user)
      await Action(request, compose([
        WrapMiddleware(model)
      ]), false)
    })
    .get('/profile', async(ctx) => {
      const request = ProfileRequest.get(ctx)
      const model = ProfileModel.get(ctx.user)
      await Action(request, compose([
        WrapMiddleware(model)
      ]), false)
    })

  return router
}