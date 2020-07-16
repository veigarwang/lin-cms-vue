import {
    post,
    get,
    put,
    _delete,
} from '@/lin/plugin/axios'

class Culture {

    async addCulture(params) {
        const res = await post('api/base/culture', params)
        return res
    }

    async editCulture(data) {
        const res = await put(`api/base/culture/`, data)
        return res
    }

    async deleteCulture(id) {
        const res = await _delete(`api/base/culture/${id}`)
        return res
    }
    async getCultures(params) {
        const res = await get('api/base/culture', params)
        return res
    }

    async getCulture(id) {
        const res = await get(`api/base/culture/${id}`)
        return res
    }
}
export default new Culture()
