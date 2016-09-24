
export function ChatApi(request) {
  return {
    async send(data: Object) {
      return await request('POST', '/chat/messages', data)
    }
  }
}