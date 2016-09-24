
export function FileApi(request) {
  return {
    async create(data: Object) {
      return await request('POST', '/files', data)
    },
    async update(id: number, data: Object) {
      return await request('PUT', '/files/' + id, data)
    },
    async remove(id: number) {
      return await request('DELETE', '/files/' + id)
    },
    async list(where: Object = {}, sort: Object = {}, page: number = 1) {
      const url = '/files' + '/?where=' + JSON.stringify(where)
        + '&sort=' + JSON.stringify(sort) + '&page=' + page
      return await request('GET', url)
    }
  }
}