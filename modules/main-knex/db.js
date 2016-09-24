
import {File} from './tables/files'
import {User} from './tables/users'
import {AuthMail, AuthSms} from './tables/auth'
import {Room} from './tables/rooms'
import {ObjectTable} from './tables/objects'
import {Tag} from './tables/tags'
import {Directory} from './tables/directories'
import {Role} from './tables/roles'
import {Field} from './tables/fields'
import {Friend} from './tables/friends'

export function DB(bookshelf, knex) {
  return {
    knex: knex,
    bookshelf: bookshelf,
    File: File(bookshelf, knex),
    User: User(bookshelf, knex),
    Room: Room(bookshelf, knex),
    Object: ObjectTable(bookshelf, knex),
    Tag: Tag(bookshelf, knex),
    Directory: Directory(bookshelf, knex),
    Role: Role(bookshelf, knex),
    Field: Field(bookshelf, knex),
    AuthMail: AuthMail(bookshelf, knex),
    AuthSms: AuthSms(bookshelf, knex),
    Friend: Friend(bookshelf, knex)
  }
}