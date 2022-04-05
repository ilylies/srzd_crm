import Layout from '@/layout'
// import EmptyLayout from '@/layout/empty'

export default {
  path: '/user',
  component: Layout,
  redirect: '/user/list',
  name: 'nameExample',
  meta: {
    title: '账号管理',
    icon: 'user'
  },
  children: [
    {
      path: 'list',
      name: 'userList',
      component: () =>
        import(
          /* webpackChunkName: 'name_example' */ '@/views/users_example/list'
        ),
      meta: {
        title: '账号列表'
      }
    },
    {
      path: 'team',
      name: 'teamList',
      component: () =>
        import(
          /* webpackChunkName: 'name_example' */ '@/views/users_example/team'
        ),
      meta: {
        title: '团队列表'
      }
    },
    {
      path: 'detail',
      name: 'userDetail',
      component: () =>
        import(
          /* webpackChunkName: 'name_example' */ '@/views/users_example/detail'
        ),
      meta: {
        title: '账号详情',
        sidebar: false,
        activeMenu: '/user/list'
      }
    }
    // {
    //     path: 'list2',
    //     name: 'breadcrumbExampleList2',
    //     component: EmptyLayout,
    //     redirect: '/name_example/list2',
    //     meta: {
    //         title: '列表2（层级模式）'
    //     },
    //     children: [
    //         {
    //             path: '',
    //             component: () => import(/* webpackChunkName: 'name_example' */ '@/views/name_example/list2'),
    //             meta: {
    //                 title: '列表2（层级模式）',
    //                 sidebar: false,
    //                 breadcrumb: false
    //             }
    //         },
    //         {
    //             path: 'detail2',
    //             name: 'breadcrumbExampleDetail2',
    //             component: () => import(/* webpackChunkName: 'name_example' */ '@/views/name_example/detail2'),
    //             meta: {
    //                 title: '详情2',
    //                 sidebar: false,
    //                 activeMenu: '/name_example/list2'
    //             }
    //         }
    //     ]
    // }
  ]
}
