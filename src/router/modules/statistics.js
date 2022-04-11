import Layout from '@/layout'
// import EmptyLayout from '@/layout/empty'

export default {
  path: '/statistics',
  component: Layout,
  redirect: '/statistics',
  name: 'statistics',
  meta: {
    title: '放款统计',
    icon: 'eye-open'
  },
  children: [
    {
      path: '',
      name: 'statisticsExample',
      component: () =>
        import(
          /* webpackChunkName: 'statisticsExample' */ '@/views/statistics/index'
        ),
      meta: {
        title: '放款统计'
      }
    }
  ]
}
