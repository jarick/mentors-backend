
import Router from 'koa-router'
import AuthRequest from '../requests/auth'
import AuthModel from '../models/auth'
import {Action, compose, WrapMiddleware} from './../../../lib/rest'

export default () => {
  const router = new Router()

  router
    .post('/authorization/mail/send', async (ctx) => {
      const request = AuthRequest.sendEmail(ctx)
      const model = AuthModel.sendEmail(ctx.db, ctx.errors, ctx.mainOptions.smtp)
      await Action(request, compose([
        WrapMiddleware(model)
      ]), ctx.db)
    })
    .post('/authorization/mail/verify', async (ctx) => {
      const request = AuthRequest.verifyEmail(ctx)
      const model = AuthModel.verifyEmail(ctx.db, ctx.errors)
      await Action(request, compose([
        WrapMiddleware(model)
      ]), ctx.db)
    })
/*
    .post('/auth/mail/reset', async (ctx) => {
      const request = AuthRequest.resetEmail(ctx)
      const model = AuthModel.resetEmail(ctx.db)
      await Action(request, compose([
        WrapMiddleware(model)
      ]))
    })
    .post('/auth/mail/confirm', async (ctx) => {
      const request = AuthRequest.confirmEmail(ctx)
      const model = AuthModel.confirmEmail(ctx.db)
      await Action(request, compose([
        WrapMiddleware(model)
      ]))
    })
*/
    .post('/authorization/mail/login', async (ctx) => {
      const request = AuthRequest.loginEmail(ctx)
      const model = AuthModel.loginEmail(ctx.db, ctx.errors)
      await Action(request, compose([
        WrapMiddleware(model)
      ]), ctx.db)
    })
    .post('/authorization/sms/send', async (ctx) => {
      const request = AuthRequest.sendSms(ctx)
      const model = AuthModel.sendSms(ctx.db, ctx.errors, ctx.mainOptions.sms)
      await Action(request, compose([
        WrapMiddleware(model)
      ]), ctx.db)
    })
    .post('/authorization/sms/verify', async (ctx) => {
      const request = AuthRequest.verifySms(ctx)
      const model = AuthModel.verifySms(ctx.db, ctx.errors)
      await Action(request, compose([
        WrapMiddleware(model)
      ]), ctx.db)
    })
  return router
}