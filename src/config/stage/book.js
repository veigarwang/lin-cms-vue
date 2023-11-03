const bookRouter = {
  route: '/book/list',
  name: 'BookList',
  title: '书籍管理',
  type: 'view', // 类型: folder, tab, view
  icon: 'iconfont icon-tushuguanli',
  filePath: 'view/book/book-list.vue', // 文件路径
  order: 1,
  inNav: true,
  children: [
    {
      title: '图书列表',
      type: 'view',
      name: 'BookList',
      route: '/book/list',
      filePath: 'view/book/book-list.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
    {
      title: '添加图书',
      type: 'view',
      name: 'BookCreate',
      route: '/book/add',
      filePath: 'view/book/book.vue',
      inNav: true,
      icon: 'iconfont icon-add',
    },
  ],
}

export default bookRouter
