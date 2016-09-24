
export function TagApi(request) {
  return {
    async create(data: Object) {
      return await request('POST', '/tags', data)
    },
    async update(id: number, data: Object) {
      return await request('PUT', '/tags/' + id, data)
    },
    async remove(id: number) {
      return await request('DELETE', '/tags/' + id)
    },
    async list(where: Object = {}, sort: Object = {}, page: number = 1) {
      const url = '/tags' + '/?where=' + JSON.stringify(where)
        + '&sort=' + JSON.stringify(sort) + '&page=' + page
      return await request('GET', url)
    }
  }
}