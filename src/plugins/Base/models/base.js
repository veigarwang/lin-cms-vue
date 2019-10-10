import {
  post,
  get,
  put,
  _delete,
} from '@/lin/plugins/axios'

class Base {

  async addItem(params) {
    const res = await post('v1/item', params)
    return res
  }

  async getItem(id) {
    const res = await get(`v1/item/${id}`)
    return res
  }

  async editItem(id, data) {
    const res = await put(`v1/item/${id}`, data)
    return res
  }

  async deleteItem(id) {
    const res = await _delete(`v1/item/${id}`)
    return res
  }

  async getItems(params) {
    const res = await get('v1/item', params)
    return res
  }

  async addType(params) {
    const res = await post('v1/type', params)
    return res
  }

  async getType(id) {
    const res = await get(`v1/type/${id}`)
    return res
  }

  async editType(id, data) {
    const res = await put(`v1/type/${id}`, data)
    return res
  }

  async deleteType(id) {
    const res = await _delete(`v1/type/${id}`)
    return res
  }

  async getTypes(params) {
    const res = await get('v1/type', params)
    return res
  }
}

export default new Base()
