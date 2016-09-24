
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

export type SmsAuth = {
  id: number,
  type: 'sms',
  phone: string,
  country: string,
  deviceId: string,
  pushToken: string
}

export type MailAuth = {
  id: number,
  type: 'mail',
  mail: string
}

export type User = {
  id: number,
  uuid: string,
  login: string,
  active: boolean,
  name: ?string,
  avatar: ?string,
  last_name: ?string,
  second_name: ?string,
  external_auth_id: ?string,
  state: Object,
  admin_notes: ?string,
  roles: Array<string>
}

export type AuthEntity = {
  auth: SmsAuth | MailAuth,
  user: User
}

export function Auth(db) {
  return {
    async byToken(token: string): ?AuthEntity {
      let decoded
      try {
        decoded = jwt.verify(token, 'secret')
      } catch (e) {
        return null
      }
      let auth
      switch (decoded.authType) {
        case 'mail':
          auth = await new db.AuthMail({id: decoded.authId}).fetch()
          break
        case 'sms':
          auth = await new db.AuthSms({id: decoded.authId}).fetch()
          break
      }
      if (auth) {
        if (!bcrypt.compareSync(decoded.token, auth.get('token_hash'))) {
          return null
        }
        const user = await new db.User({id: decoded.userId}).fetch()
        let result = {}
        switch (decoded.authType) {
          case 'mail':
            result.auth = {
              id: auth.get('id'),
              type: 'mail',
              mail: auth.get('mail')
            }
            break
          case 'sms':
            result.auth = {
              id: auth.get('id'),
              type: 'sms',
              phone: auth.get('phone'),
              country: auth.get('country'),
              deviceId: auth.get('device_id'),
              pushToken: auth.get('push_token')
            }
            break
        }
        const roles = await db.knex('roles')
          .leftJoin('users_roles', 'roles.id', 'users_roles.role_id')
          .where({"users_roles.user_id": user.get('id')})
          .select('roles.name as name')
        result.user = {
          id: user.get('id'),
          uuid: user.get('uuid'),
          login: user.get('login'),
          active: user.get('active') > 0,
          name: user.get('name'),
          avatar: user.get('avatar'),
          last_name: user.get('last_name'),
          second_name: user.get('second_name'),
          external_auth_id: user.get('external_auth_id'),
          state: JSON.parse(user.get('state')),
          admin_notes: user.get('admin_notes'),
          roles: roles.map(item => item.name)
        }
        return result
      }
    }
  }
}