const blogRouter = {
  route: null,
  name: null,
  title: "工作台",
  type: "folder", // 类型: folder, tab, view
  icon: "iconfont icon-tushuguanli",
  filePath: "views/Blog/",
  order: null,
  inNav: true,
  children: [
    {
      name: null,
      title: "标签管理",
      type: "view",
      name: "TagList",
      route: "/cms/tag/list",
      filePath: "plugins/Blog/views/tag/TagList.vue",
      inNav: true,
      right: ["所有标签"]
    },
    {
      name: null,
      title: "专栏管理",
      type: "view",
      name: "ClassifyList",
      route: "/cms/classify/list",
      filePath: "plugins/Blog/views/classify/ClassifyList.vue",
      inNav: true
    },
    {
      name: null,
      title: "随笔管理",
      type: "view",
      name: "CmsArticleList",
      route: "/cms/article/list",
      filePath: "plugins/Blog/views/article/CmsArticleList.vue",
      inNav: true,
      icon: "iconfont icon-tushuguanli",
      right: ["审核随笔", "删除随笔"]
    },
    {
      name: null,
      title: "我的随笔",
      type: "view",
      name: "ArticleList",
      route: "/article/list",
      filePath: "plugins/Blog/views/article/ArticleList.vue",
      inNav: true,
      icon: "iconfont icon-tushuguanli"
    },
    {
      name: "CommentList",
      title: "评论管理",
      type: "view",
      route: "/comment/list",
      filePath: "plugins/Blog/views/comment/CommentList.vue",
      inNav: true,
      icon: "iconfont icon-tushuguanli",
      right: ["评论列表"]
    },
    {
      name: "BlogHome",
      title: "博客首页",
      type: "view",
      route: "/blog/home",
      filePath: "plugins/Blog/views/home/Index.vue",
      inNav: true,
      icon: "iconfont icon-tushuguanli"
    },
    {
      title: "博客详情页",
      type: "view",
      name: "ArticleDetail",
      route: "/post/:id",
      filePath: "plugins/Blog/views/home/ArticleDetail.vue",
      inNav: false
    }
  ]
};

export default blogRouter;
