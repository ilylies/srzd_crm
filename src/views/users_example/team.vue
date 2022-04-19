<template>
  <div>
    <page-main>
      <el-data-table ref="table" v-bind="tableConfig" />
      <el-dialog
        :title="dialogText"
        :visible.sync="dialogVisible"
        width="50%"
      >
        <el-form-renderer ref="form" label-width="80px" :content="content" />
        <span slot="footer" class="dialog-footer">
    
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </el-dialog>
    </page-main>
  </div>
</template>
<script>
// import { LEVEL_OPTIONS } from './const.ts'
export default {
  data() {
    return {
      dialogVisible: false,
      dialogText: '新增',
      tableConfig: {
        url: '/api/team/list',
        hasNew: false,
        hasEdit: false,
        hasDelete: false,
        headerButtons: [
          {
            type: 'primary',
            text: '新增',
            atClick: () => {
              this.dialogText = '新增'
              this.dialogVisible = true
              this.$nextTick(() => {
                this.setOptions('1,2')
                this.setOptions(3)
              })
              return Promise.resolve(false)
            }
          }
        ],
        extraButtons: [
          {
            type: 'primary',
            text: '修改',
            atClick: data => {
              this.dialogText = '修改'
              this.dialogVisible = true
              this.updateData = data
              this.$nextTick(() => {
                this.setOptions('1,2')
                this.setOptions(3)
                this.$refs.form.updateForm({
                  name: data.name,
                  captain: data.captain,
                  members: data.members
                })
              })
              return Promise.resolve(false)
            }
          },
          {
            type: 'danger',
            text: '删除',
            atClick: ({id, name, captain}) => {
              this.$confirm(`确定要删除${name}这条数据吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                if (captain != this.$store.state.user.id && this.$store.state.user.level != 1) {
                  return this.$message.error('你不是管理员或团长，无权进行此操作')
                }
                this.$api.delete('/api/team/delete/' + id).then(() => {
                  this.$message.success('删除成功')
                  this.$refs.table.getList()
                })
              })
              
              return Promise.resolve(false)
            }
          }
        ],
        columns: [
          {
            prop: 'name',
            label: '团队名称'
          },
          {
            prop: 'captain',
            label: '团长',
            formatter: ({captain}) => {
              return this.userList.find(i => {
                return captain === i.value
              }).label
            }
          },
          {
            prop: 'members',
            label: '团员',
            formatter: ({members}) => {
              return this.userList.filter(i => {
                return members.includes(i.value)
              }).map(item => item.label).join(',')
            }
          }
        ],
        searchForm: [
          {
            type: 'input',
            id: 'name',
            label: '团队名称',
            el: {
              placeholder: '请输入'
            }
          }
        ]
      },
      content: [
        {
          type: 'input',
          id: 'name',
          label: '团队名称',
          rules: [
            {
              required: true,
              message: '请输入团队名称',
              trigger: 'blur',
              transform: v => v && v.trim()
            }
          ],
          el: { placeholder: '请输入团队名称' }
        },
        {
          type: 'select',
          id: 'captain',
          label: '团长',
          options: this.getCaptainList,
          rules: [
            {
              required: true,
              message: '请选择账号类型',
              trigger: 'blur'
            }
          ],
          el: { placeholder: '请选择团长', filterable: true }
        },
        {
          type: 'select',
          id: 'members',
          label: '团员',
          options: this.getMembersList,
          rules: [
            {
              required: true,
              message: '请选择团员',
              trigger: 'blur'
            }
          ],
          el: { placeholder: '请选择团员', multiple: true, filterable: true }
        }
      ],
      userList: [],
      captainList: [],
      membersList: [],
      updateData: {}
    }
  },
  computed: {
  },
  mounted() {
    this.getUsersByLevel('1,2')
    this.getUsersByLevel(3)
    this.getUsersByLevel('')
  },
  methods: {
    getUsersByLevel(level) {
      this.$api.$get('/api/users/usersByLevel', {params: {level}}).then(res => {

        this[level === 3 ? 'membersList' : level ? 'captainList' : 'userList'] = res.payload.map(i => {
          return {
            label: i.name,
            value: i.id
          }
        })
      })
    },
    setOptions(level) {
      this.$refs.form.setOptions(level === 3 ? 'members' : 'captain', this[level === 3 ? 'membersList' : 'captainList'])
    },
    submit() {
      if (this.dialogText === '修改' && this.updateData.captain != this.$store.state.user.id && this.$store.state.user.level != 1) {
        return this.$message.error('你不是管理员或团队团员，无权进行此操作')
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$api[this.dialogText === '新增' ? 'post' : 'put'](this.dialogText === '新增' ? '/api/team/create' : '/api/team/update/' + this.updateData.id, this.$refs.form.getFormValue()).then(() => {
            this.$message.success(this.dialogText + '成功')
            this.dialogVisible = false
            this.$refs.table.getList()
          })
        } else {
          
          return false
        }
      })
    }
  }
}
</script>
