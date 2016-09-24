
import Router from 'koa-router'
import Request from '../requests/pushes'
import Model from '../models/pushes'
import {Action, compose, WrapMiddleware} from './../../../lib/rest/index'

export default () => {
	const router = new Router()

	router
		.post('/pushes/gcm/send', async(ctx) => {
			const request = Request.send(ctx)
			const model = Model.sendGcmPush(ctx.db, ctx.pushes)
			await Action(request, compose([
				WrapMiddleware(model)
			]))
		})
		.post('/pushes/apn/send', async(ctx) => {
			const request = Request.send(ctx)
			const model = Model.sendApnPush(ctx.db, ctx.pushes)
			await Action(request, compose([
				WrapMiddleware(model)
			]))
		})

	return router
}