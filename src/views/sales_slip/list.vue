<template>
  <div>
    <page-main>
      <el-data-table
        ref="table"
        v-bind="tableConfig"
        :search-form="searchForm"
        @selection-change="onSelectionChange"
      />
      <!-- <el-dialog title="跟进记录" :visible.sync="dialogTableVisible">
        <el-table :data="recordList">
          <el-table-column
            property="userId"
            label="修改人"
            :formatter="userIdFormatter"
          />
          <el-table-column property="content" label="跟进记录" />
          <el-table-column property="createTime" label="创建时间" />
        </el-table>
      </el-dialog>
      <el-dialog title="批款情况" :visible.sync="dialogAppropriationVisible">
        <el-table :data="appropriation">
          <el-table-column
            property="appropriation_status"
            label="银行"
            :formatter="bankFormatter"
          />
          <el-table-column property="amount" label="放款金额" />
        </el-table>
      </el-dialog> -->
      <el-dialog
        :title="dialogText"
        :visible.sync="dialogVisible"
        @close="updateData = {}"
      >
        <el-form-renderer
          ref="form"
          v-model="updateData"
          label-width="100px"
          :content="content"
        >
          <el-form-item slot="id:team" label="批款情况">
            <Appropriation
              ref="appropriation"
              :readonly="!disabledFn(updateData)"
              :values="updateData.appropriation"
            />
          </el-form-item>
        </el-form-renderer>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </el-dialog>
      <ImportDialog
        :visible="showImportDialog"
        :user-list="userList"
        :team-list="teamList"
        @close-dialog="showImportDialog = false"
        @success="$refs.table.getList()"
      />
    </page-main>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import { APPROPRIATION_STATYS_OPTIONS, COMPANY_TAGS_OPTIONS } from './const.js'
import { companyNamePattern } from '@/util/pattern'
import ImportDialog from './components/import-dialog'
import { templateColumns } from './components/import-dialog/template-columns'
import { exportExcel } from '@femessage/excel-it'
import Appropriation from './components/appropriation'
export default {
  components: {
    ImportDialog,
    Appropriation
  },
  data() {
    return {
      APPROPRIATION_STATYS_OPTIONS,
      dialogVisible: false,
      showImportDialog: false,
      dialogText: '新增',
      dialogTableVisible: false,
      dialogAppropriationVisible: false,
      updateData: {},
      money: '',
      recordList: [],
      selectData: [],
      appropriation: [],
      tableConfig: {
        url: '/api/saleSlips/list',
        hasNew: false,
        hasEdit: false,
        hasDelete: false,
        // tableEventHandlers: {
        //   'cell-click': (row, column) => {
        //     if (column.property === 'record') {
        //       this.recordList = JSON.parse(row.record)
        //       this.dialogTableVisible = true
        //     }
        //     if (column.property === 'appropriation') {
        //       this.appropriation = row.appropriation
        //       this.dialogAppropriationVisible = true
        //     }
        //   }
        // },
        headerButtons: [
          {
            type: 'primary',
            text: '新增',
            atClick: () => {
              this.dialogText = '新增'
              this.dialogVisible = true
              this.updateData = {}
              this.$refs.form && this.$refs.form.resetFields()
              return Promise.resolve(false)
            }
          },
          {
            type: 'primary',
            text: '批量导入',
            atClick: () => {
              this.showImportDialog = true
              return Promise.resolve(false)
            }
          },
          {
            type: 'primary',
            text: '批量导出',
            disabled: () => !this.selectData.length,
            atClick: () => {
              const data = JSON.parse(JSON.stringify(this.selectData)).map(
                i => {
                  i.create_time = dayjs(i.create_time).format(
                    'YYYY-MM-DD HH:mm:ss'
                  )
                  i.company_tags = COMPANY_TAGS_OPTIONS.find(
                    item => item.value === i.company_tags
                  ).label
                  i.appropriation_status = i.appropriation
                    .map(item => {
                      const data = APPROPRIATION_STATYS_OPTIONS.find(
                        i => i.value == item.appropriation_status
                      )
                      return data.label + '+' + item.amount
                    })
                    .join(',')
                  i.team = this.teamList.find(
                    item => item.value == i.team
                  ).label
                  i.telemarketer = this.userList.find(
                    item => item.value == i.telemarketer
                  ).label
                  const recordList = i.record ? JSON.parse(i.record) : []
                  i.record = recordList
                    .map(item => {
                      return (
                        '修改人:' +
                        this.userList.find(j => j.value == item.userId).label +
                        ',跟进记录:' +
                        item.content +
                        ',创建时间:' +
                        item.createTime
                      )
                    })
                    .join(';')
                  return i
                }
              )
              exportExcel({
                columns: Object.keys(templateColumns).map(k => ({
                  prop: k,
                  label: templateColumns[k]
                })),
                data,
                fileName: '批量导出销售单'
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
              this.updateData = data
              this.dialogVisible = true
              this.$nextTick(() => {
                this.$refs.form.updateForm(data)
              })
              return Promise.resolve(false)
            }
          },
          {
            type: 'danger',
            text: '删除',
            atClick: data => {
              if (this.$store.state.user.level != 1) {
                this.$message.error('你不是管理员，无权进行此操作')
                return Promise.reject(false)
              }
              this.$confirm(`确定要删除${name}这条数据吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.$api
                  .delete('/api/saleSlips/delete/' + data.id)
                  .then(() => {
                    this.$refs.table.getList()
                    this.$message.success('删除成功')
                  })
                  .catch(() => {
                    this.$message.error('删除失败')
                  })
              })
              return Promise.resolve(false)
            }
          }
        ],
        persistSelection: true,
        columns: [
          { type: 'selection' },
          {
            prop: 'id',
            label: 'id',
            width: '50px'
          },
          {
            prop: 'create_time',
            label: '建档时间',
            width: '180px',
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
            prop: 'loan_amount',
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
            formatter: ({ record }) => {
              if (!record) {
                return ''
              }
              const data = JSON.parse(record)
              return (
                <el-popover
                  popper-class="record-popper"
                  trigger="hover"
                  placement="top"
                >
                  <div class="poper-item">
                    {data.map(i => {
                      const uesrName = this.userList.find(
                        user => user.value == i.userId
                      ).label
                      const text = uesrName + '：' + i.content
                      return <p>{text}。</p>
                    })}
                  </div>
                  <el-button type="text" slot="reference">
                    查看
                  </el-button>
                </el-popover>
              )
            }
          },
          {
            prop: 'appropriation',
            label: '批款情况',
            formatter: ({ appropriation }) => {
              return (
                <el-popover
                  popper-class="record-popper"
                  trigger="hover"
                  placement="top"
                >
                  <div class="poper-item">
                    {appropriation.map(i => {
                      const text = '银行：' + this.bankFormatter(i) + '，金额：' + i.amount
                      return <p>{text}</p>
                    })}
                  </div>
                  <el-button type="text" slot="reference">
                    查看
                  </el-button>
                </el-popover>
              )
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
        ]
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
    content() {
      return [
        {
          type: 'input',
          id: 'company_name',
          label: '企业名称',
          disabled: row => !this.disabledFn(row),
          rules: [
            {
              required: true,
              trigger: 'blur',
              validator: (rule, value, callback) => {
                if (!value) {
                  callback(new Error('请输入企业名称'))
                } else {
                  if (!companyNamePattern.test(value)) {
                    return callback(
                      new Error('请输入2-30个之间的企业名称,支持中英文和数字')
                    )
                  }
                  callback()
                }
              },
              transform: v => v && v.trim()
            }
          ],
          el: { placeholder: '请输入企业名称' }
        },
        {
          type: 'input',
          id: 'company_contact_name',
          label: '企业联系人/法人',
          disabled: row => !this.disabledFn(row),
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
        // {
        //   type: 'input',
        //   id: 'loan_amount',
        //   label: '放款金额',
        //   disabled: row => !this.disabledFn(row),
        //   rules: [
        //     {
        //       required: true,
        //       trigger: 'blur',
        //       transform: v => v && v.trim(),
        //       validator: (rule, value, callback) => {
        //         if (!value) {
        //           callback(new Error('请输入放款金额'))
        //         } else {
        //           if (!numberPattern.test(value)) {
        //             return callback(new Error('请输入数字'))
        //           }
        //           callback()
        //         }
        //       }
        //     }
        //   ],
        //   el: { placeholder: '请输入放款金额' }
        // },
        {
          type: 'select',
          id: 'company_tags',
          label: '企业标签',
          options: COMPANY_TAGS_OPTIONS,
          disabled: row => !this.disabledFn(row),
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
          id: 'team',
          label: '所属团队',
          options: this.teamList,
          disabled: row => !this.disabledFn(row),
          atChange: () => {
            this.updateData.telemarketer = ''
          },
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
          options: this.getTelemarketerList,
          disabled: row => !this.disabledFn(row),
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
  watch: {
    'updateData.id'(val) {
      if (val) {
        const members = this.teamList.find(
          i => i.value === this.updateData.team
        ).members
        const arr = this.userList.filter(i => members.includes(i.value))
        this.$nextTick(() => {
          this.$refs.form.setOptions('telemarketer', arr)
        })
      }
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
              captain: i.captain,
              members: i.members
            }
          })
        })
    },
    userIdFormatter(row) {
      return this.userList.find(i => i.value == Number(row.userId)).label
    },
    bankFormatter(row) {
      return APPROPRIATION_STATYS_OPTIONS.find(
        i => i.value == row.appropriation_status
      ).label
    },
    disabledFn(row) {
      const data = this.teamList.find(i => i.value == row.team)
      const findTeamCaptain = data && data.captain
      if (
        findTeamCaptain == this.$store.state.user.id ||
        this.$store.state.user.level == 1 ||
        this.dialogText === '新增'
      ) {
        // 所属团长或管理员
        return true
      }
      return false
    },
    async submit() {
      const appropriationValue = await this.$refs.appropriation.validate()
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!appropriationValue) return
          if (this.dialogText === '修改') {
            this.updateFn(appropriationValue)
          } else {
            this.addFn(appropriationValue)
          }
        }
      })
    },
    addFn(appropriationValue) {
      const data = this.$refs.form.getFormValue()
      const record = JSON.stringify([
        {
          userId: this.$store.state.user.id,
          createTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          content: data.addRecord
        }
      ])
      this.$api
        .post(
          '/api/saleSlips/create',
          Object.assign(
            {},
            { ...data, record, appropriation_status: appropriationValue }
          )
        )
        .then(() => {
          this.$message.success(this.dialogText + '成功')
          this.dialogVisible = false
          this.$refs.table.getList()
        })
        .catch(() => {
          this.$message.warning(this.dialogText + '失败')
        })
    },
    updateFn(appropriationValue) {
      const data = this.$refs.form.getFormValue()
      if (
        data.telemarketer != this.$store.state.user.id &&
        !this.disabledFn(data)
      ) {
        this.$message.error('你不是管理员或此订单电销员，无权进行此操作')
        return Promise.reject(false)
      }
      const record = {
        userId: this.$store.state.user.id,
        createTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        content: data.addRecord
      }
      const recordList = JSON.parse(this.updateData.record) || []

      if (data.addRecord) {
        recordList.push(record)
      }
      this.$api
        .put(
          '/api/saleSlips/update/' + data.id,
          Object.assign(
            {},
            {
              ...data,
              record: JSON.stringify(recordList),
              appropriation_status: appropriationValue
            }
          )
        )
        .then(() => {
          this.$message.success(this.dialogText + '成功')
          this.dialogVisible = false
          this.$refs.table.getList()
        })
        .catch(() => {
          this.$message.warning(this.dialogText + '失败')
        })
    },
    onSelectionChange(data) {
      this.selectData = data
    }
  }
}
</script>
<style lang="scss">
.appropriation-status {
    display: flex;
}
.record-popper {
    padding-bottom: 0;
    .poper-item {
        max-width: 50vw;
        height: auto;
        max-height: 80vh;
        overflow: scroll;
    }
    p {
        margin: 0;
    }
}
</style>
