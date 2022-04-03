import Layout from '@/layout'
// import EmptyLayout from '@/layout/empty'

export default {
  path: '/account',
  component: Layout,
  redirect: '/account/list',
  name: 'accountExample',
  meta: {
    title: '账号管理',
    icon: 'sidebar-breadcrumb'
  },
  children: [
    {
      path: 'list',
      name: 'accountList',
      component: () =>
        import(
          /* webpackChunkName: 'account_example' */ '@/views/account_example/list'
        ),
      meta: {
        title: '账号列表'
      }
    },
    {
      path: 'detail',
      name: 'accountDetail',
      component: () =>
        import(
          /* webpackChunkName: 'account_example' */ '@/views/account_example/detail'
        ),
      meta: {
        title: '账号详情',
        sidebar: false,
        activeMenu: '/account/list'
      }
    }
    // {
    //     path: 'list2',
    //     name: 'breadcrumbExampleList2',
    //     component: EmptyLayout,
    //     redirect: '/account_example/list2',
    //     meta: {
    //         title: '列表2（层级模式）'
    //     },
    //     children: [
    //         {
    //             path: '',
    //             component: () => import(/* webpackChunkName: 'account_example' */ '@/views/account_example/list2'),
    //             meta: {
    //                 title: '列表2（层级模式）',
    //                 sidebar: false,
    //                 breadcrumb: false
    //             }
    //         },
    //         {
    //             path: 'detail2',
    //             name: 'breadcrumbExampleDetail2',
    //             component: () => import(/* webpackChunkName: 'account_example' */ '@/views/account_example/detail2'),
    //             meta: {
    //                 title: '详情2',
    //                 sidebar: false,
    //                 activeMenu: '/account_example/list2'
    //             }
    //         }
    //     ]
    // }
  ]
}
