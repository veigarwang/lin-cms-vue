import { post, get, put, _delete } from "@/lin/plugin/axios";

class Doc {

  async getDocs(params) {
    const res = await get("api/base/docs", params);
    return res;
  }

  async getDoc(id) {
    const res = await get(`api/base/docs/${id}`);
    return res;
  }

  async addDoc(params) {
    const res = await post("api/base/docs", params);
    return res;
  }

  async editDoc(id, data) {
    const res = await put(`api/base/docs/${id}`, data);
    return res;
  }

  async deleteDoc(id) {
    const res = await _delete(`api/base/docs/${id}`);
    return res;
  }
 
}

export default new Doc();
