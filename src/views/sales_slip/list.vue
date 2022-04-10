<template>
  <div>
    <page-main>
      <el-data-table
        ref="table"
        v-bind="tableConfig"
        :form="form"
        :search-form="searchForm"
      />
      <el-dialog title="跟进记录" :visible.sync="dialogTableVisible">
        <el-table :data="recordList">
          <el-table-column property="userId" label="修改人" :formatter="userIdFormatter" width="150" />
          <el-table-column property="content" label="跟进记录" width="200" />
          <el-table-column property="createTime" label="创建时间" />
        </el-table>
      </el-dialog>
    </page-main>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import { APPROPRIATION_STATYS_OPTIONS, COMPANY_TAGS_OPTIONS } from './const.ts'
export default {
  data() {
    return {
      dialogTableVisible: false,
      appropriation_status: '',
      money: '',
      recordList: [],
      tableConfig: {
        url: '/api/saleSlips/list',
        tableEventHandlers: {
          'cell-click': (row, column) => {
            if (column.property === 'record') {
              this.recordList = JSON.parse(row.record)
              this.dialogTableVisible = true
            }
          }
        },
        columns: [
          {
            prop: 'create_time',
            label: '建档时间',
            formatter: ({ create_time }) => {
              return dayjs(create_time).format('YYYY-MM-DD HH:mm:ss')
            }
          },
          {
            prop: 'company_name',
            label: '企业名称'
          },
          {
            prop: 'company_contact_name',
            label: '企业联系人/法人'
          },
          {
            prop: 'company_phone',
            label: '放款金额'
          },
          {
            prop: 'company_tags',
            label: '企业标签',
            formatter: ({ company_tags }) => {
              return COMPANY_TAGS_OPTIONS.find(i => i.value === company_tags)
                .label
            }
          },
          {
            prop: 'record',
            label: '跟进记录',
            formatter: () => {
              return <el-button type="text">查看</el-button>
            }
          },
          {
            prop: 'appropriation_status',
            label: '批款情况',
            formatter: ({ appropriation_status }) => {
              const data = APPROPRIATION_STATYS_OPTIONS.find(
                i => i.value == appropriation_status
              )
              return data ? data.label : appropriation_status
            }
          },
          {
            prop: 'team',
            label: '所属团队',
            formatter: ({ team }) => {
              return this.teamList.find(i => i.value === team).label
            }
          },
          {
            prop: 'telemarketer',
            label: '电销员',
            formatter: ({ telemarketer }) => {
              return this.userList.find(i => i.value === telemarketer).label
            }
          }
        ],
        onNew: data => {
          const record = JSON.stringify([{
            userId: this.$store.state.user.id,
            createTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            content: data.addRecord
          }])
          return this.$api.post('/api/saleSlips/create', Object.assign({}, {...data, record}))
        },
        onEdit: (data, row) => {
          if (
            row.telemarketer != this.$store.state.user.id &&
            !this.disabledFn(row)
          ) {
            this.$message.error('你不是管理员或此订单电销员，无权进行此操作')
            return Promise.reject(false)
          }
          const record = {
            userId: this.$store.state.user.id,
            createTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            content: data.addRecord
          }
          const recordList = JSON.parse(row.record)
          recordList.push(record)
          return this.$api.put('/api/saleSlips/update/' + data.id, Object.assign({}, {...data, record: JSON.stringify(recordList)}))
        },
        onDelete: data => {
          if (
            this.$store.state.user.level != 1
          ) {
            this.$message.error('你不是此订单电销员或管理员，无权进行此操作')
            return Promise.reject(false)
          }
          return this.$api.delete('/api/saleSlips/delete/' + data.id)
        }
      },
      userList: [],
      teamList: []
    }
  },
  computed: {
    searchForm() {
      return [
        {
          type: 'input',
          id: 'company_name',
          label: '企业名称',
          el: {
            placeholder: '请输入'
          }
        },
        {
          type: 'select',
          id: 'company_tags',
          label: '企业标签',
          options: COMPANY_TAGS_OPTIONS,
          el: {
            placeholder: '请选择',
            clearable: true
          }
        },
        {
          type: 'select',
          id: 'appropriation_status',
          label: '批款情况',
          options: APPROPRIATION_STATYS_OPTIONS,
          el: {
            placeholder: '请选择(其他金额请直接输入)',
            clearable: true,
            filterable: true,
            'allow-create': true,
            'default-first-option': true
          }
        },
        {
          type: 'select',
          id: 'team',
          label: '所属团队',
          options: this.teamList,
          el: {
            placeholder: '请选择',
            clearable: true
          }
        },
        {
          type: 'select',
          id: 'telemarketer',
          label: '电销员',
          options: this.userList,
          el: {
            placeholder: '请选择',
            clearable: true
          }
        }
      ]
    },
    form() {
      return [
        {
          type: 'input',
          id: 'company_name',
          label: '企业名称',
          rules: [
            {
              required: true,
              message: '请输入企业名称',
              trigger: 'blur',
              transform: v => v && v.trim()
            }
          ],
          el: { placeholder: '请输入企业名称' }
        },
        {
          type: 'input',
          id: 'company_contact_name',
          label: '企业联系人/法人',
          rules: [
            {
              required: true,
              message: '请输入企业联系人/法人',
              trigger: 'blur',
              transform: v => v && v.trim()
            }
          ],
          el: { placeholder: '请输入企业联系人/法人' }
        },
        {
          type: 'input',
          id: 'company_phone',
          label: '放款金额',
          rules: [
            {
              required: true,
              message: '请输入放款金额',
              trigger: 'blur',
              transform: v => v && v.trim()
            }
          ],
          el: { placeholder: '请输入放款金额' }
        },
        {
          type: 'select',
          id: 'company_tags',
          label: '企业标签',
          options: COMPANY_TAGS_OPTIONS,
          rules: [
            {
              required: true,
              message: '请选择企业标签',
              trigger: 'blur'
            }
          ],
          el: { placeholder: '请选择企业标签' }
        },
        {
          type: 'input',
          id: 'addRecord',
          label: '新增跟进记录',
          rules: [
            {
              message: '请输入跟进记录',
              transform: v => v && v.trim()
            }
          ],
          el: { placeholder: '请输入跟进记录' }
        },
        {
          type: 'select',
          id: 'appropriation_status',
          label: '批款情况',
          options: APPROPRIATION_STATYS_OPTIONS,
          rules: [
            {
              required: true,
              message: '请选择批款情况',
              trigger: 'blur'
            }
          ],
          el: {
            placeholder: '请选择(其他金额请直接输入)',
            filterable: true,
            'allow-create': true,
            'default-first-option': true
          }
        },
        {
          type: 'select',
          id: 'team',
          label: '所属团队',
          options: this.teamList,
          rules: [
            {
              required: true,
              message: '请选择所属团队',
              trigger: 'blur'
            }
          ],
          el: { placeholder: '请选择所属团队' }
        },
        {
          type: 'select',
          id: 'telemarketer',
          label: '电销员',
          options: this.userList,
          rules: [
            {
              required: true,
              message: '请选择电销员',
              trigger: 'blur'
            }
          ],
          el: { placeholder: '请选择电销员' }
        }
      ]
    }
  },
  mounted() {
    this.getUsersByLevel()
    this.getTeamList()
  },
  methods: {
    getUsersByLevel() {
      this.$api
        .$get('/api/users/list', { params: { page: 1, size: 99999 } })
        .then(res => {
          this.userList = res.payload.content.map(i => {
            return {
              label: i.name,
              value: i.id
            }
          })
        })
    },
    getTeamList() {
      this.$api
        .$get('/api/team/list', { params: { page: 1, size: 99999 } })
        .then(res => {
          this.teamList = res.payload.content.map(i => {
            return {
              label: i.name,
              value: i.id,
              captain: i.captain
            }
          })
        })
    },
    userIdFormatter(row) {
      return this.userList.find(i => i.value === Number(row.userId)).label
    },
    disabledFn(row) {
      const findTeamCaptain = this.teamList.find(i => i.value === row.team).captain
      if (findTeamCaptain === this.$store.state.user.id || this.$store.state.user.level === 1) {
        // 所属团长或管理员
        return true
      }
      return false
    }
  }
}
</script>
<style lang="scss">
.appropriation-status {
    display: flex;
}
</style>
