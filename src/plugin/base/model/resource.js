import {
    post,
    get,
    put,
    _delete,
} from '@/lin/plugin/axios'

class Resource {

    async addResource(params) {
        const res = await post('api/base/resource', params)
        return res
    }

    async editResource(data) {
        const res = await put(`api/base/resource/`, data)
        return res
    }

    async deleteResource(id) {
        const res = await _delete(`api/base/resource/${id}`)
        return res
    }
    async getResources(params) {
        const res = await get('api/base/resource', params)
        return res
    }

    async getResource(id) {
        const res = await get(`api/base/resource/${id}`)
        return res
    }
}
export default new Resource()
