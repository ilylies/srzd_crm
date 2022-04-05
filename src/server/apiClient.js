import Vue from 'vue'

import axios, { api } from '@/util/request'

Vue.prototype.$axios = api
Vue.prototype.$api = axios
