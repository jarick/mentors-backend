
import type {PushServiceEntity, PushEntity} from './../services/pushes'
import type {DatabaseService} from './../services/db'

type Request = {
	user_id: number,
	push: PushEntity
}

const findPushTokenByUserId = async (db: DatabaseService, userId: number) => {
	const list = await db.knex('users_auth_sms').where({user_id: userId}).select('push_token')
	return list.filter(item => !!item.push_token).map(item => item.push_token)
}

export default {
	sendApnPush(db: DatabaseService, pushes: PushServiceEntity) {
		return async(data: Request) => {
			let result = 'error'
			for(let token of await findPushTokenByUserId(db, data.user_id)){
				if (await pushes.sendApnPush({pushToken: token, push: data.push})) {
					result = 'ok'
				}
			}
			return {
				result: result
			}
		}
	},
	sendGcmPush(db: DatabaseService, pushes: PushServiceEntity) {
		return async(data: Request) => {
			let result = 'error'
			for(let token of await findPushTokenByUserId(db, data.user_id)){
				if (await pushes.sendGcmPush({pushToken: token, push: data.push})) {
					result = 'ok'
				}
			}
			return {
				result: result
			}
		}
	}
}