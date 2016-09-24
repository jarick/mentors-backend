
export function RoomApi(request) {
  return {
    async create(data: Object) {
      return await request('POST', '/rooms', data)
    },
    async update(id: number, data: Object) {
      return await request('PUT', '/rooms/' + id, data)
    },
    async remove(id: number) {
      return await request('DELETE', '/rooms/' + id)
    },
    async list(where: Object = {}, sort: Object = {}, page: number = 1) {
      const url = '/rooms' + '/?where=' + JSON.stringify(where)
        + '&sort=' + JSON.stringify(sort) + '&page=' + page
      return await request('GET', url)
    }
  }
}