
export function PushApi(request) {
	return {
		apn: {
			async send(data) {
				return await request('POST', '/push/apn/send', data)
			}
		},
		gcm: {
			async send(data) {
				return await request('POST', '/push/gcm/send', data)
			}
		}
	}
}