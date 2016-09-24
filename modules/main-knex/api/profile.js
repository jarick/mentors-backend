
export function ProfileApi(request) {
  return {
    async save(data: Object) {
      return await request('POST', '/profile', data)
    },
    async get(where: Object = {}, sort: Object = {}, page: number = 1) {
      const url = '/profile' + '/?where=' + JSON.stringify(where)
        + '&sort=' + JSON.stringify(sort) + '&page=' + page
      return await request('GET', url)
    }
  }
}