
export function DirectoryApi(request) {
  return {
    async create(data: Object) {
      return await request('POST', '/directories', data)
    },
    async update(id: number, data: Object) {
      return await request('PUT', '/directories/' + id, data)
    },
    async remove(id: number) {
      return await request('DELETE', '/directories/' + id)
    },
    async list(where: Object = {}, sort: Object = {}, page: number = 1) {
      const url = '/directories' + '/?where=' + JSON.stringify(where)
        + '&sort=' + JSON.stringify(sort) + '&page=' + page
      return await request('GET', url)
    }
  }
}