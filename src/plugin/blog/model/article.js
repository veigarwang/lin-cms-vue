import { post, get, put, _delete } from "@/lin/plugin/axios";

// 我们通过 class 这样的语法糖使模型这个概念更加具象化，其优点：耦合性低、可维护性。
class Article {
  // constructor() {}

  // 类中的方法可以代表一个用户行为
  async addArticle(info) {
    const res = await post("api/blog/articles/", info);
    return res;
  }

  // 在这里通过 async await 语法糖让代码同步执行
  // 1. await 一定要搭配 async 来使用
  // 2. await 后面跟的是一个 Promise 对象
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
