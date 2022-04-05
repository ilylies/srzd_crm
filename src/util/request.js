import axios from 'axios'
import store from '@/store/index'
import router from '@/router'
import { Message } from 'element-ui'

const toLogin = () => {
  router.push({
    path: '/login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

const service = {}

// Request helpers
const reqMethods = [
  'request',
  'delete',
  'get',
  'head',
  'options', // url, config
  'post',
  'put',
  'patch', // url, data, config
  '$get',
  '$put',
  '$delete',
  '$post'
]

axios.interceptors.request.use(
  async function(config) {

    const token = store.state.user.token
   
    // jwt 验证
    if (token) {
      config.headers.common['Authorization'] = `Bearer ${token}`
    }

    return config
  },
  function(error) {
    Message.error(error)
    // Do something with request error
    return Promise.reject(error)
  },
)

axios.interceptors.response.use(
  function(response) {
    if (response.data.code != 200) {
      // 如果接口请求时发现 token 失效，则立马跳转到登录页
      if (response.data.code == 401) {
        toLogin()
      }
      Message.error(response.data.msg)
      return Promise.reject(response)
    }
    return Promise.resolve(response)
  },
  function(error) {
    Message.error(error)
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error.response)
  },
)

reqMethods.forEach(method => {
  service[method] = (...rest) => {
    // 对$开头的方法不做任何处理
    if (method.startsWith('$')) {
      return axios[method.replace('$', '')]
        .apply(null, rest)
        .then(res => {
          return res.data
        })
    }
    return axios[method].apply(null, rest).then(res => res)
  }
})

export const GET = service.$get
export const POST = service.$post
export const DELETE = service.$delete
export const PUT = service.$put
export const api = axios

export default service
