
import Router from 'koa-router'
import ChatRequest from '../requests/chat'
import ChatModel from '../models/chat'
import {Action, compose, WrapMiddleware} from './../../../lib/rest'

export default () => {
  const router = new Router()
  router
    .post('/chat/messages', async(ctx) => {
      const request = ChatRequest.send(ctx)
      const model = ChatModel.send(ctx.knex, ctx.errors, ctx.redis, ctx.user)
      await Action(request, compose([
        WrapMiddleware(model)
      ]))
    })

  return router
}