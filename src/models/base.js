import {
  post,
  get,
  put,
  _delete,
} from '@/lin/plugins/axios'

class Base {

  async addBaseItem(params) {
    const res = await post('v1/item', params)
    return res
  }

  async getBaseItem(id) {
    const res = await get(`v1/item/${id}`)
    return res
  }

  async editBaseItem(id, data) {
    const res = await put(`v1/item/${id}`, data)
    return res
  }

  async deleteBaseItem(id) {
    const res = await _delete(`v1/item/${id}`)
    return res
  }

  async getBaseItems(params) {
    const res = await get('v1/item', params)
    return res
  }
}

export default new Base()
