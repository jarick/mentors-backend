
const createError = require('http-errors')
const send = require('request')
const assert = require('assert')
import {AuthApi} from './auth'
import {DirectoryApi} from './directories'
import {FieldApi} from './fields'
import {ChatApi} from './chat'
import {FileApi} from './files'
import {ObjectApi} from './objects'
import {ProfileApi} from './profile'
import {RoleApi} from './roles'
import {RoomApi} from './rooms'
import {TagApi} from './tags'
import {UserApi} from './users'
import {PushApi} from './pushes'

type Method = 'GET' | 'POST' | 'DELETE' | 'PUT'
const request = (uri: string, token: ?string = null) => (method: Method, url: string, postData: ?Object = {}) => {
  let options = {
    uri: uri + url,
    method: method,
    json: true
  }
  if (token) {
    options.headers = { 'Authorization': 'Bearer ' + token }
  }
  if (method === 'POST' || method === 'PUT') {
    options.body = postData
  }
  return new Promise((resolve, reject) => {
    send(options, (error, response, body) => {
      if (error) {
        reject(error)
      } else {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          resolve(body)
        } else {
          reject(createError(response.statusCode, body))
        }
      }
    })
  })
}

export const Api = async (uri, mail: string, password: string) => {
  const auth = AuthApi(request(uri))
  const authIns = await auth.mail.login({
    mail: mail,
    password: password
  })
  assert(authIns.token, 'User is not found')
  const token = authIns.token
  return {
    chat: ChatApi(request(uri, token)),
    directories: DirectoryApi(request(uri, token)),
    fields: FieldApi(request(uri, token)),
    files: FileApi(request(uri, token)),
    objects: ObjectApi(request(uri, token)),
    profile: ProfileApi(request(uri, token)),
    roles: RoleApi(request(uri, token)),
    rooms: RoomApi(request(uri, token)),
    tags: TagApi(request(uri, token)),
    users: UserApi(request(uri, token)),
    pushes: PushApi(request(uri, token))
  }
}