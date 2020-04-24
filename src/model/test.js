import _axios, { get, put, _delete } from '@/lin/plugin/axios'

class Test {

  async getTest(id) {
    const res = await get(`cms/test`)
    return res
  }

}

export default new Test()
