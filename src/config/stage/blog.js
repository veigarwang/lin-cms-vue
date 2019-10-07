const blogRouter = {
  route: null,
  name: null,
  title: "博客管理",
  type: "folder", // 类型: folder, tab, view
  icon: "iconfont icon-tushuguanli",
  order: null,
  inNav: true,
  children: [
    {
      name: null,
      title: "随笔管理",
      type: "folder", // 取 route 为默认加载页
      icon: "iconfont icon-huiyuanguanli",
      inNav: true,
      children: [
        {
          title: "添加随笔",
          type: "view",
          name: "articleFormAdd",
          route: "/article/form",
          filePath: "views/blog/article/ArticleForm.vue",
          inNav: true,
          icon: "iconfont icon-tushuguanli"
        },
        {
          title: "编辑随笔",
          type: "view",
          name: "articleFormEdit",
          route: "/article/form/:id",
          filePath: "views/blog/article/ArticleForm.vue",
          inNav: false,
          icon: "iconfont icon-tushuguanli"
        },
        {
          title: "随笔列表",
          type: "view",
          name: "articleList",
          route: "/article/list",
          filePath: "views/blog/article/ArticleList.vue",
          inNav: true,
          icon: "iconfont icon-tushuguanli"
        }
      ]
    },
    {
      name: "CommentList",
      title: "评论管理",
      type: "view",
      route: "/comment/list",
      filePath: "views/blog/comment/CommentList.vue",
      inNav: true,
      icon: "iconfont icon-tushuguanli"
    }
  ]
};

export default blogRouter;
