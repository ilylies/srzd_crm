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
        columns: [
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
            id: 'name',
            label: '用户名',
            rules: [
              {
                required: true,
                message: '请输入用户名',
                trigger: 'blur',
                transform: v => v && v.trim()
              }
            ],
            el: { placeholder: '请输入用户名' }
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
            el: { placeholder: '请输入密码', type: 'password' }
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
        onEdit: (data, row) => {
          console.log(this.$store.state.user)
          if (row.id != this.$store.state.user.id && this.$store.state.user.level != 1) {
            this.$message.error('你不是管理员无权限进行此操作')
            return Promise.reject(false)
          }
          return this.$api.put('/api/users/update/' + data.id, data)
        },
        onDelete: (data, row) => {
          if (row.id != this.$store.state.user.id && this.$store.state.user.level != 1) {
            this.$message.error('你不是管理员无权限进行此操作')
            return Promise.reject(false)
          }
          return this.$api.delete('/api/users/delete/' + data.id)
        }
      }
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>
