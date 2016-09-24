

import {Api} from './../../../modules/main-knex/api/index'

export async function migrate() {

	const api = await Api('http://localhost:3010/api/v1', 'admin@email.no', 'passw0rd')
	await api.objects.create({
		active: true,
		code: 'tags',
		name: 'Tags',
		acl: JSON.stringify({"*": 1, "admin": 7}),
		permissions: JSON.stringify({})
	})

	await api.fields.create({
		name: 'name',
		type: 'string',
		notNull: true,
		schema: JSON.stringify({
			type: 'string',
			maxLength: 255
		}),
		object: 'tags'
	})

	await api.fields.create({
		name: 'image',
		type: 'string',
		notNull: false,
		schema: JSON.stringify({
			type: 'integer',
			exists: {"table": "obj_files", "column": "id"}
		}),
		object: 'tags'
	})

	await api.fields.create({
		name: 'description',
		type: 'string',
		notNull: false,
		schema: JSON.stringify({
			type: 'string'
		}),
		object: 'tags'
	})

	await api.objects.create({
		active: true,
		code: 'ratings',
		name: 'Ratings',
		acl: JSON.stringify({
			"*": 6,
			"admin": 7
		}),
		permissions: JSON.stringify({})
	})

	await api.fields.create({
		name: 'user',
		type: 'integer',
		notNull: true,
		schema: JSON.stringify({
			type: 'integer',
			exists: {"table": "users", "column": "id"}
		}),
		object: 'ratings'
	})

	await api.fields.create({
		name: 'tag',
		type: 'integer',
		notNull: true,
		schema: JSON.stringify({
			type: 'integer',
			exists: {"table": "obj_tags", "column": "id"}
		}),
		object: 'ratings'
	})

	await api.fields.create({
		name: 'value',
		type: 'string',
		notNull: true,
		schema: JSON.stringify({
			type: 'integer',
		}),
		object: 'ratings'
	})

	await api.objects.create({
		active: true,
		code: 'tasks',
		name: 'Tasks',
		acl: JSON.stringify({
			"*": 6,
			"admin": 7
		}),
		permissions: JSON.stringify({})
	})

	await api.fields.create({
		name: 'name',
		type: 'string',
		notNull: true,
		schema: JSON.stringify({
			type: 'string',
			maxLength: 255,
		}),
		object: 'tasks'
	})

	await api.fields.create({
		name: 'description',
		type: 'string',
		notNull: false,
		schema: JSON.stringify({
			type: 'string',
		}),
		object: 'tasks'
	})

	await api.fields.create({
		name: 'rating',
		type: 'integer',
		notNull: true,
		schema: JSON.stringify({
			type: 'integer',
		}),
		object: 'tasks'
	})

	await api.fields.create({
		name: 'user',
		type: 'integer',
		notNull: true,
		schema: JSON.stringify({
			type: 'integer',
			exists: {"table": "users", "column": "id"}
		}),
		object: 'tasks'
	})

	await api.objects.create({
		active: true,
		code: 'status',
		name: 'Status',
		acl: JSON.stringify({
			"*": 6,
			"admin": 7
		}),
		permissions: JSON.stringify({})
	})

	/*
	 check:
	 type: "boolean"
	 time:
	 type: "string"
	 item:
	 type: "number"
	 user:
	 type: "number"
	 */
}