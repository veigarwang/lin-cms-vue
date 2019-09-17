const baseRouter = {
    route: null,
    name: null,
    title: '基础资料',
    type: 'folder', // 类型: folder, tab, view
    icon: 'iconfont icon-tushuguanli',
    order: null,
    inNav: true,
    children: [
        {
            name: null,
            title: '字典管理',
            type: 'view',
            name: 'BaseItem',
            route: '/base/item',
            filePath: 'views/base/item/BaseItem.vue',
            inNav: true,
            icon: 'iconfont icon-tushuguanli',
        },
    ],
}

export default baseRouter;
