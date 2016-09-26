import {Api} from './modules/main-knex/api/index'
const SocketIoClient = require('socket.io-client')
const client = SocketIoClient('https://find-mentors-api.herokuapp.com', {
	query: 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6InRxaWFtY2tzY295aHZ4YyIsImF1dGhUeXBlIjoibWFpbCIsImF1dGhJZCI6NCwidXNlcklkIjo0LCJpYXQiOjE0NzQ4NTI5MTB9.lk3BGuxmcrLxUUdHtMaAXo-bOK6bsf_KNqsC3WnmltU'
})
client.on('connect', () => {
	console.log('connect')

	const test = async () => {
		const api = await Api('https://find-mentors-api.herokuapp.com/api/v1', 'admin@email.no', 'passw0rd')

		await api.chat.send({
			room: 114,
			body: '{"msg": "test"}'
		})
	}
	test().then(() => console.log('send'), (err) => console.log(err))
});
client.on('message', (data) => {
	console.log(data)
});
client.on('disconnect', () => {
	console.log('disconnect')
});
client.on('error', (err) => {
	console.log(err)
})

