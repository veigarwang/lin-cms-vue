import {
  post,
  get,
  put,
  _delete,
} from '@/lin/plugin/axios'

class Base {

  async addItem(params) {
    const res = await post('api/base/item', params)
    return res
  }

  async getItem(id) {
    const res = await get(`api/base/item/${id}`)
    return res
  }

  async editItem(id, data) {
    const res = await put(`api/base/item/${id}`, data)
    return res
  }

  async deleteItem(id) {
    const res = await _delete(`api/base/item/${id}`)
    return res
  }

  async getItems(params) {
    const res = await get('api/base/item', params)
    return res
  }

  async addType(params) {
    const res = await post('api/base/type', params)
    return res
  }

  async getType(id) {
    const res = await get(`api/base/type/${id}`)
    return res
  }

  async editType(id, data) {
    const res = await put(`api/base/type/${id}`, data)
    return res
  }

  async deleteType(id) {
    const res = await _delete(`api/base/type/${id}`)
    return res
  }

  async getTypes(params) {
    const res = await get('api/base/type', params)
    return res
  }
}

export default new Base()
