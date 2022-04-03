<template>
  <div>
    <page-main>
      <el-data-table ref="table" v-bind="tableConfig" />
    </page-main>
  </div>
</template>
<script>
import { LEVEL_OPTIONS } from './const.ts'
export default {
  data() {
    return {
      tableConfig: {
        url: '/api/users/list',
        // dataPath: 'content',
        columns: [
          {
            prop: 'account',
            label: '账号'
          },
          {
            prop: 'name',
            label: '用户名'
          },
          {
            prop: 'level',
            label: '账号类型',
            formatter: ({ level }) => {
              return LEVEL_OPTIONS.find(i => i.value === level).label
            }
          }
        ],
        searchForm: [
          {
            type: 'input',
            id: 'name',
            label: '用户名',
            el: {
              placeholder: '请输入'
            }
          }
        ],
        form: [
          {
            type: 'input',
            id: 'account',
            label: '手机号',
            rules: [
              {
                required: true,
                message: '请输入手机号',
                trigger: 'blur',
                transform: v => v && v.trim()
              }
            ],
            el: { placeholder: '请输入手机号' }
          },
          {
            type: 'input',
            id: 'password',
            label: '密码',
            rules: [
              {
                required: true,
                message: '请输入密码',
                trigger: 'blur',
                transform: v => v && v.trim()
              }
            ],
            el: { placeholder: '请输入密码' }
          },
          {
            type: 'input',
            id: 'name',
            label: '姓名'
          },
          {
            type: 'select',
            id: 'level',
            label: '账号类型',
            options: LEVEL_OPTIONS,
            rules: [
              {
                required: true,
                message: '请选择账号类型',
                trigger: 'blur'
              }
            ],
            el: { placeholder: '请选择账号类型' }
          }
        ],
        onNew: data => {
          return this.$api.post('/api/users/create', data)
        },
        onEdit: data => {
          console.log(12312)
          return this.$api.put('/api/users/update', data)
        }
      }
    }
  }
}
</script>
