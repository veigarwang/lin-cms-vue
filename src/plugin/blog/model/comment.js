import { post, get, put, _delete } from "@/lin/plugin/axios";

class Comment {

  async addComment(info) {
    const res = await post("api/blog/comments/", info);
    return res;
  }

  async getComment(id) {
    const res = await get(`api/blog/comments/${id}`);
    return res;
  }

  async editComment(id, info) {
    const res = await put(`api/blog/comments/${id}?is_audit=${info}`);
    return res;
  }

  async delectComment(id) {
    const res = await _delete(`api/blog/comments/cms/${id}`);
    return res;
  }

  async getComments(pagesParmas) {
    const res = await get("api/blog/comments/", pagesParmas);
    return res;
  }
}

export default new Comment();
