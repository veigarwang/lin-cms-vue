import { post, get, put, _delete } from "@/lin/plugin/axios";


class Article {



  async addArticle(info) {
    const res = await post("api/blog/articles/", info);
    return res;
  }

  async getArticle(id) {
    const res = await get(`api/blog/articles/${id}`);
    return res;
  }

  async editArticle(id, info) {
    const res = await put(`api/blog/articles/${id}`, info);
    return res;
  }

  async auditArticle(id, is_audit) {
    const res = await put(`api/blog/articles/audit/${id}?is_audit=${is_audit}`);
    return res;
  }


  async deleteArticle(id) {
    const res = await _delete(`api/blog/articles/${id}`);
    return res;
  }

  async deleteCmsArticle(id) {
    const res = await _delete(`api/blog/articles/cms/${id}`);
    return res;
  }

  async getArticles(pagesParmas) {
    const res = await get("api/blog/articles/", pagesParmas);
    return res;
  }

  async getAllArticles(pagesParmas) {
    const res = await get("api/blog/articles/all", pagesParmas);
    return res;
  }
}

export default new Article();
