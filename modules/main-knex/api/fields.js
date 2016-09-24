
export function FieldApi(request) {
  return {
    async create(data: Object) {
      return await request('POST', '/fields', data)
    },
    async update(id: number, data: Object) {
      return await request('PUT', '/fields/' + id, data)
    },
    async remove(id: number) {
      return await request('DELETE', '/fields/' + id)
    },
    async list(where: Object = {}, sort: Object = {}, page: number = 1) {
      const url = '/fields' + '/?where=' + JSON.stringify(where)
        + '&sort=' + JSON.stringify(sort) + '&page=' + page
      return await request('GET', url)
    }
  }
}