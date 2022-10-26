const baseRouter = {
  route: null,
  name: null,
  title: "基础资料",
  type: "folder", // 类型: folder, tab, view
  icon: "iconfont icon-tushuguanli",
  order: null,
  inNav: true,
  children: [
    {
      name: null,
      title: "字典管理",
      type: "view",
      name: "ItemList",
      route: "/base/item",
      filePath: "plugin/base/view/item/item-list.vue",
      inNav: true
    },
    {
      name: null,
      title: "字典类别管理",
      type: "view",
      name: "TypeList",
      route: "/base/type",
      filePath: "plugin/base/view/type/type-list.vue",
      inNav: true
    },
    {
      name: null,
      title: "本地化语言",
      type: 'tab',
      inNav: true,
      children: [{
        title: '本地化语言',
        type: 'view',
        name: 'culture-list',
        route: '/base/culture/list',
        filePath: 'plugin/base/view/culture/culture-list.vue',
        inNav: false,
      },
      {
        title: "新增本地化",
        type: "view",
        name: "culture-form",
        route: "/base/culture/form/:id?",
        filePath: "plugin/base/view/culture/culture-form.vue",
        inNav: false,
        props: true
      }]
    },
    {
      name: null,
      title: "文档管理",
      type: "view",
      name: "DocList",
      route: "/base/doc/list",
      filePath: "plugin/base/view/doc/doc-list.vue",
      inNav: true,
      permission: ["所有文档"]
    }
  ]
};

export default baseRouter;
