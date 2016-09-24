
export function RoleApi(request) {
  return {
    async create(data: Object) {
      return await request('POST', '/roles', data)
    },
    async update(id: number, data: Object) {
      return await request('PUT', '/roles/' + id, data)
    },
    async remove(id: number) {
      return await request('DELETE', '/roles/' + id)
    },
    async list(where: Object = {}, sort: Object = {}, page: number = 1) {
      const url = '/roles' + '/?where=' + JSON.stringify(where)
        + '&sort=' + JSON.stringify(sort) + '&page=' + page
      return await request('GET', url)
    }
  }
}