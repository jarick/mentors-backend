
const apn = require('apn')
const gcm = require('node-gcm')
const debug = require('debug')('push')

export type PushEntity = {
	alert: string,
	badge: ?number,
	sound: ?string,
	title: ?string,
	playload: ?Object
}

type PushMessageEntity = {
	push: PushEntity,
	pushToken: string
}

export type PushServiceEntity = {
	sendApnPush: (pushMessage: PushMessageEntity) => Promise<boolean>,
	sendGcmPush: (pushMessage: PushMessageEntity) => Promise<boolean>
}

export function PushService(options): PushServiceEntity {
	return {
		sendApnPush(pushMessage: PushMessageEntity) {
			const apnConnection = new apn.Connection(options.apn)
			return new Promise((resolve) => {
				const myDevice = new apn.Device(pushMessage.pushToken)
				const note = new apn.Notification()
				let isSend = false
				debug("push: " + JSON.stringify(pushMessage))
				if (pushMessage.push.badge) {
					note.badge = pushMessage.push.badge
				}
				if (pushMessage.push.sound) {
					note.sound = pushMessage.push.sound
				}
				if (pushMessage.push.playload) {
					note.payload = pushMessage.push.playload
				}
				note.alert = pushMessage.push.alert
				apnConnection.on("connected", function () {
					debug("Connected");
				})
				const send = (result) => {
					if (!isSend) {
						resolve(result)
						isSend = true;
					}
				}
				apnConnection.on('completed', () => {
					debug("completed")
					send(true)
				});
				apnConnection.on("transmitted", (notification, device) => {
					debug("Notification transmitted to:" + device.token.toString("hex"))
				});
				apnConnection.on("transmissionError", (errCode, notification, device) => {
					debug("Notification caused error: " + errCode + " for device ", device, notification)
					if (errCode === 8) {
						debug("A error code of 8 indicates that the device token is invalid. This could be for a number of reasons - are you using the correct environment? i.e. Production vs. Sandbox")
					}
					send(false)
				});
				apnConnection.on("timeout", () => {
					debug("Connection Timeout")
					send(false);
				});
				apnConnection.on("disconnected", () => {
					debug("Disconnected from APNS")
				});
				apnConnection.on("socketError", debug)
				apnConnection.pushNotification(note, myDevice)
			})
		},
		sendGcmPush(pushMessage: PushMessageEntity) {
			const gcmSender = new gcm.Sender(options.gcm.token)
			return new Promise((resolve) => {
				const message = new gcm.Message({
					priority: 'high',
					notification: {
						title: pushMessage.push.title,
						body: pushMessage.push.alert
					}
				})
				gcmSender.send(message, {registrationTokens: [pushMessage.pushToken]}, (err) => {
					if (err) {
						debug(err);
						resolve(false);
					} else {
						resolve(true);
					}
				})
			})
		}
	}
}