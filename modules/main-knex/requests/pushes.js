
import {ActionRequest} from './../../../lib/rest/index'

export default {
	send(ctx) {
		const body = ctx.request.body
		return () => ActionRequest(ctx, {
			auth() {
				return typeof ctx.user === 'object' && ctx.user.roles.indexOf('admin') > -1
			},
			async validate() {
				const ajv = ctx.ajv
				const validate = ajv.compile({
					"$async": true,
					"required": ["alert", "userId"],
					"properties": {
						"alert": {
							"type": "string"
						},
						"badge": {
							"type": "integer"
						},
						"sound": {
							"type": "string"
						},
						"title": {
							"type": "string"
						},
						"playload": {
							"type": "string",
							"json": {}
						},
						"userId": {
							"type": "integer",
							"existsId": {table: "users"}
						}
					}
				})
				try {
					await validate(body)
					return false
				} catch (e) {
					return e.errors
				}
			},
			all() {
				return {
					push: {
						alert: body.alert,
						badge: body.badge,
						sound: body.sound,
						title: body.title,
						playload: body.playload ?  JSON.parse(body.playload) : null
					},
					user_id: body.userId
				}
			}
		})
	}
}