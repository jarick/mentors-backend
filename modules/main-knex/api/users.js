
export function UserApi(request) {
  return {
    async create(data: Object) {
      return await request('POST', '/users', data)
    },
    async update(id: number, data: Object) {
      return await request('PUT', '/users/' + id, data)
    },
    async remove(id: number) {
      return await request('DELETE', '/users/' + id)
    },
    async list(where: Object = {}, sort: Object = {}, page: number = 1) {
      const url = '/users' + '/?where=' + JSON.stringify(where)
        + '&sort=' + JSON.stringify(sort) + '&page=' + page
      return await request('GET', url)
    }
  }
}