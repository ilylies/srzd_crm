import axios from 'axios'
// import Qs from 'qs'
import router from '@/router/index'
import store from '@/store/index'
import { Message } from 'element-ui'

const toLogin = () => {
  router.push({
    path: '/login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

const api = axios.create({
  baseURL: process.env.VUE_APP_API_ROOT,
  timeout: 10000,
  responseType: 'json'
  // withCredentials: true
})

api.interceptors.request.use(request => {
  if (store.getters['user/isLogin']) {
    request.headers.common['Authorization'] = `Bearer ${store.state.user.token}`
  }
  if (request.method == 'post') {
    if (request.data instanceof FormData) {
      if (store.getters['user/isLogin']) {
        // 如果是 FormData 类型（上传图片）
        request.data.append('token', store.state.user.token)
      }
    } else {
      // 带上 token
      if (request.data == undefined) {
        request.data = {}
      }

      // request.data = Qs.stringify(request.data)
    }
  } else {
    // 带上 token
    if (request.params == undefined) {
      request.params = {}
    }
  }
  return request
})

api.interceptors.response.use(
  response => {
    if (response.data.code != 200) {
      // 如果接口请求时发现 token 失效，则立马跳转到登录页
      if (response.data.code == 401) {
        toLogin()
      }
      Message.error(response.data.msg)
      return Promise.reject(response)
    }
    return Promise.resolve(response.data)
  },
  error => {
    Message.error(error)
    return Promise.reject(error)
  }
)

export default api
