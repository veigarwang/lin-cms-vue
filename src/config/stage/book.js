const bookRouter = {
  route: '/book/list',
  name: 'BookList',
  title: '书籍管理',
  type: 'view', // 类型: folder, tab, view
  icon: 'iconfont icon-tushuguanli',
  filePath: 'view/book/book-list.vue', // 文件路径
  order: 1,
  inNav: true,
  // children: [
    // {
    //   title: '添加书籍',
    //   type: 'view',
    //   name: 'BookCreate',
    //   route: '/book/add',
    //   filePath: 'view/book/book-form.vue',
    //   inNav: true,
    //   icon: 'iconfont icon-tushuguanli',
    // },
  //   {
  //     title: '书籍管理',
  //     type: 'view',
  //     name: 'BookList',
  //     route: '/book/list',
  //     filePath: 'view/book/book-list.vue',
  //     inNav: true,
  //     icon: 'iconfont icon-tushuguanli',
  //   },
  // ],
}

export default bookRouter
