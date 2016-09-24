
const assert = require('assert')
const async = require('async')
const path = require('path')
const fs = require('fs')
import konig from './../../../../lib'
import {config} from './config'
const accountSid = 'ACa706bcada5933c32c8924f2902e54542'
const authToken = 'a98d12be39a9374ef83d045e529cc1b4'
const twilio = require('twilio')(accountSid, authToken)

describe('Pushes API', function() {
	this.timeout(5000)
	it('Responds', (done) => {
		konig(config).then((app) => {
			const request = require('co-supertest').agent(app.listen())
			async.waterfall([
				(cb) => {
					request
						.post('/api/v1/authorization/sms/send')
						.send({
							phone: '+15005550006',
							country: 'US',
							deviceId: "xxx-xxx",
							pushToken: "ddQ8xTSbFjQ:APA91bGUAsmTeFJkJiG2usHnRP1rykQ80X5TYCNgCJRnDf-yUzwqrxr6jwRjMex6IUru1iqdB7sbIV_R1-zb7a-GjgYu5rujVInDUR2grp4LGygs9AMWl6tXOdXoBuF9TojNXtNcw0Vs",
							deviceType: "web"
						})
						.expect(200)
						.end((err, res) => {
							if (err) throw err
							assert.equal(res.body.result, 'ok')
							setTimeout(() => {
								twilio.sms.messages.get((err, messages) => {
									if (err) throw err
									const match = messages.sms_messages[0].body.match(/Your confirm code: (\w+), id: (\d+)/)
									assert(match[1])
									assert(match[2], res.body.id)
									cb(null, res.body.id, match[1])
								})
							}, 500)
						})
				},
				(id, code, cb) => {
					request
						.post('/api/v1/authorization/sms/verify')
						.send({
							id: id,
							code: code
						})
						.expect(200)
						.end((err, res) => {
							if (err) throw err
							assert.equal(res.body.result, 'ok')
							cb(null, res.body.token)
						})
				},
				(token, cb) => {
					request
						.get('/api/v1/profile')
						.set('Authorization', 'Bearer ' + token)
						.send()
						.expect(200)
						.end((err, res) => {
							if (err) throw err
							cb(null, res.body.user_id)
						})
				},
				(userId, cb) => {
					request
						.post('/api/v1/authorization/mail/login')
						.send({
							mail: 'admin@email.no',
							password: "passw0rd"
						})
						.expect(200)
						.end((err, res) => {
							if (err) throw err
							assert.equal(res.body.result, 'ok')
							cb(null, res.body.token, userId)
						})
				},
				(token, userId, cb) => {
					request
						.post('/api/v1/pushes/gcm/send')
						.set('Authorization', 'Bearer ' + token)
						.send({
							userId: userId,
							alert: "test message",
						})
						.expect(200)
						.end((err, res) => {
							if (err) throw err
							assert.equal(res.body.result, 'ok')
							cb(null)
						})
				},
			], (err) => {
				done(err)
			})
		}, (err) => done(err))
	})
})