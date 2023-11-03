const blogRouter = {
  route: null,
  name: null,
  title: "工作台",
  type: "folder", // 类型: folder, tab, view
  icon: "iconfont icon-tushuguanli",
  filePath: "view/blog/",
  order: null,
  inNav: true,
  children: [
    {
      name: null,
      title: "专栏管理",
      type: "view",
      name: "ClassifyList",
      route: "/cms/classify/list",
      filePath: "plugin/blog/view/classify/classify-list.vue",
      inNav: true,
      permission: ["分类专栏列表"]
    },
    {
      name: null,
      title: "技术频道",
      type: "view",
      name: "ChannelList",
      route: "/cms/channel/list",
      filePath: "plugin/blog/view/channel/channel-list.vue",
      inNav: true,
      permission: ["技术频道列表"]
    },
    {
      name: null,
      title: "标签管理",
      type: "view",
      name: "TagList",
      route: "/cms/tag/list",
      filePath: "plugin/blog/view/tag/tag-list.vue",
      inNav: true,
      permission: ["所有标签"]
    },
    {
      name: null,
      title: "随笔管理",
      type: "view",
      name: "ArticleList",
      route: "/cms/article/list",
      filePath: "plugin/blog/view/article/article-list.vue",
      inNav: true,
      permission: ['所有随笔']
    },
    {
      name: "CommentList",
      title: "评论管理",
      type: "view",
      route: "/comment/list",
      filePath: "plugin/blog/view/comment/comment-list.vue",
      inNav: true,
      permission: ["评论列表"]
    },
    {
      title: "博客详情页",
      type: "view",
      name: "ArticleDetail",
      route: "/post/:id",
      filePath: "plugin/blog/view/home/article-detail.vue",
      inNav: false
    }
  ]
};

export default blogRouter;
