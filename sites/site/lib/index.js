
import konig from './../../../lib/index'
import main from './../../../modules/main-knex/index'
import { Chat } from './../../../modules/main-knex/chat'
const path = require('path')
const http = require('http')
const url = require('url')
const SocketIO = require('socket.io')

const configMain = {
	api: {
		prefix: '/api/v1'
	},
	redis: process.env.NODE_ENV === 'production'
		? 'redis://h:pdo01umoghm5vk4mps903f76s8q@ec2-54-75-250-129.eu-west-1.compute.amazonaws.com:15829'
		: ''
	,
	knex: {
		client: 'mysql',
		connection: {
			host : 'eu-cdbr-west-01.cleardb.com',
			user : 'bd04e6f98278bb',
			password : 'be08a89d',
			database : 'heroku_0df0b3d2207582f'
		},
		pool: { min: 0, max: 1 }
	},
	smtp: {
		transporter: {
			host: 'mailtrap.io',
			auth: {
				user: "450055d4d2e18cd36",
				pass: "859054d4ee83fb"
			},
			port: 2525
		},
		messages: {
			code: {
				from: '"Find mentors" <support@find-mentor.me>',
				subject: 'Confirm your authorization',
				html: 'Your confirm code: <a href="/auth/confirm/#@id#/#@code#">link</a>'
			}
		}
	},
	amqp: 'amqp://mbyuxgdc:oaQnw931tG4dMTd7MGW3bWpRyNN87wVy@chicken.rmq.cloudamqp.com/mbyuxgdc'
}
const config = {
	emitter: {
		maxListeners: 20
	},
	logs: path.join(path.dirname(__dirname), 'logs'),
	modules: {
		main: main(configMain),
	}
}
konig(config).then((app) => {
	try {
		const io = SocketIO(app.listen(process.env.PORT))
		io.on('connection', (socket) => {
			Chat(configMain)(io, socket).then(
				(result) => null,
				(err) => console.log(err)
			)
		})
	} catch(e) {
		console.log(e)
	}
})