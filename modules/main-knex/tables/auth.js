
export type UserAuthMailSendEntity = {
  mail: string
}

export type UserAuthMailVerifyEntity = {
  id: number,
  password: string,
  checkword: string
}

export type UserAuthMailLoginEntity = {
  mail: string,
  password: string
}

export type UserAuthSmsSendEntity = {
  phone: string,
  country: string,
  push_token: ?string,
  device_id: string,
  device_type: string
}

export type UserAuthSmsVerifyEntity = {
  id: number,
  code: string
}

export const AuthMail = (bookshelf) => bookshelf.Model.extend({
  tableName: 'users_auth_mail',
})

export const AuthSms = (bookshelf) => bookshelf.Model.extend({
  tableName: 'users_auth_sms',
})