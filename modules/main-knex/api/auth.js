
export function AuthApi(request) {
  return {
    sms: {
      async send(data) {
        return await request('POST', '/authorization/sms/send', data)
      },
      async verify(data) {
        return await request('POST', '/authorization/sms/verify', data)
      }
    },
    mail: {
      async send(data) {
        return await request('POST', '/authorization/mail/send', data)
      },
      async verify(data) {
        return await request('POST', '/authorization/mail/send', data)
      },
      async login(data) {
        return await request('POST', '/authorization/mail/login', data)
      }
    }
  }
}