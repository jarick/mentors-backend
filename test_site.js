
import {Api} from './modules/main-knex/api/index'
const SocketIoClient = require('socket.io-client')
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6Iml3N2M3YTg2cm5pNDB2OCIsImF1dGhUeXBlIjoibWFpbCIsImF1dGhJZCI6NCwidXNlcklkIjo0LCJpYXQiOjE0NzQ4MTU5NTR9.T8IbC2I_KEsgyiHfJn7KVR50JIfJflKt07SUUxr3z9U'
const client = SocketIoClient('https://find-mentors-api.herokuapp.com', {
	query: 'token=' + token
})

client.on('message', (data) => {
	console.log(data)
})

const test =  async () => {

	const api = await Api('https://find-mentors-api.herokuapp.com/api/v1', 'admin@email.no', 'passw0rd')

	await api.chat.send({
		room: 114,
		body: JSON.stringify({result: 'ok'})
	})
	console.log('send')
}

test().then(
	() => console.log('+'), (err) => console.error(err)
)