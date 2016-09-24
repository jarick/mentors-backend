
export type FriendEntity = {
	phone: string,
	name: ?string
}

export const Friend = (bookshelf, knex) => bookshelf.Model.extend({
	tableName: 'friends',
	toArray: async function() {
		const contact = await knex('users')
			.where('id', this.get('profile'))
			.first('id', 'name', 'avatar')
		return {
			id: this.get('id'),
			name: this.get('name'),
			profile: contact
		}
	}
})
