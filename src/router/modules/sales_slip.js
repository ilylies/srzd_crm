import Layout from '@/layout'
// import EmptyLayout from '@/layout/empty'

export default {
  path: '/salesSlip',
  component: Layout,
  redirect: '/salesSlip/list',
  name: 'nameExample',
  meta: {
    title: '销售单',
    icon: 'fixed-right-buy'
  },
  children: [
    {
      path: 'list',
      name: 'userList',
      component: () =>
        import(
          /* webpackChunkName: 'name_example' */ '@/views/sales_slip/list'
        ),
      meta: {
        title: '销售单列表'
      }
    }
  ]
}
