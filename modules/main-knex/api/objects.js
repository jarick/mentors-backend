
export function ObjectApi(request) {
  return {
    async create(data: Object) {
      return await request('POST', '/objects', data)
    },
    async update(id: number, data: Object) {
      return await request('PUT', '/objects/' + id, data)
    },
    async remove(id: number) {
      return await request('DELETE', '/objects/' + id)
    },
    async list(where: Object = {}, sort: Object = {}, page: number = 1) {
      const url = '/objects' + '/?where=' + JSON.stringify(where)
        + '&sort=' + JSON.stringify(sort) + '&page=' + page
      return await request('GET', url)
    }
  }
}