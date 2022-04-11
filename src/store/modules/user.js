import api from '@/util/request'

const state = {
  token: localStorage.token || '',
  id: localStorage.id || '',
  name: localStorage.name || '',
  level: localStorage.level || 3,
  permissions: []
}

const getters = {
  isLogin: state => {
    if (state.token) {
      return true
    }
    return false
  }
}

const actions = {
  login({ commit }, data) {
    return new Promise((resolve, reject) => {
      // 通过 mock 进行登录
      try {
        api
          .$get('/api/users/login', {
            params: data
          })
          .then(res => {
            console.log(res.payload)
            commit('setUserData', res.payload)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      } catch (error) {
        console.log(error)
      }
      
    })
  },
  logout({ commit }) {
    commit('removeUserData')
    commit('menu/invalidRoutes', null, { root: true })
  },
  // 获取我的权限
  getPermissions({ state, commit }) {
    return new Promise(resolve => {
      // 通过 mock 获取权限
      api
        .get('mock/member/permission', {
          params: {
            name: state.name
          }
        })
        .then(res => {
          commit('setPermissions', res.data.permissions)
          resolve(res.data.permissions)
        })
    })
  }
}

const mutations = {
  setUserData(state, data) {
    localStorage.setItem('name', data.name)
    localStorage.setItem('token', data.token)
    localStorage.setItem('name', data.name)
    localStorage.setItem('id', data.id)
    localStorage.setItem('level', data.level)
    state.id = data.id
    state.name = data.name
    state.token = data.token
    state.name = data.name
    state.level = data.level
  },
  removeUserData(state) {
    localStorage.removeItem('name')
    localStorage.removeItem('token')
    localStorage.removeItem('name')
    localStorage.removeItem('id')
    localStorage.removeItem('level')
    state.name = ''
    state.token = ''
    state.name = ''
    state.id = ''
    state.level = 3
  },
  setPermissions(state, permissions) {
    state.permissions = permissions
  }
}

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
}
