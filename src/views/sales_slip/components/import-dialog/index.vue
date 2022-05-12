<template>
  <el-dialog
    :visible="visible"
    class="importDialog"
    title="批量导入"
    @close="onDialogClose"
  >
    <div v-show="importedData.length === 0" class="import-data">
      <div
        class="upload-area"
        @click="handleImportExcel"
        @drop="onUploadAreaDrop"
        @dragover="onUploadAreaDragOver"
      >
        <img class="upload-area-icon" src="./images/excel.svg">
        <div class="upload-area-title">上传 excel 表</div>
        <div class="el-upload__text">
          将文件拖到此处，或
          <el-button type="text" class="btn-click">点击上传</el-button>
        </div>
      </div>

      <div class="import-data-tip">
        如果没有excel导入模板，请先
        <el-button type="text" class="btn-click" @click="handleDownloadTemplate">
          下载
        </el-button>
      </div>
    </div>

    <div v-show="importedData.length" class="imported-page">
      <el-button type="primary" @click="handleImportExcel">重新导入</el-button>

      <div class="imported-counter">
        当前已经导入
        <el-button type="text">{{ importedData.length }}</el-button>
        <span>条数据</span>
      </div>
      <div class="imported-counter">
        当前有
        <el-button type="text" color="green">{{ successData.length }}</el-button>
        <span>条正确数据</span>
      </div>
      <el-data-table ref="table" v-bind="tableConfig" :columns="columns" />
      <div v-show="errorData.length">
        <div class="imported-counter">
          当前有
          <el-button type="text" style="color: red;">{{ errorData.length }}</el-button>
          <span>条错误数据，请查看错误信息</span>
        </div>
        <el-button type="primary" @click="handleExportExcel">下载错误数据</el-button>
        <el-data-table ref="errorTable" v-bind="tableConfig" :extra-buttons="[]" :has-operation="false" :columns="errorColumns" />
      </div>
      <div
        slot="footer"
        class="footer"
        style="text-align: right; margin-top: 20px;"
      >
        <el-button @click="$emit('close-dialog')">取消</el-button>
        <el-button
          :loading="confirmButtonLoading"
          :disabled="!successData.length"
          type="primary"
          @click="handleSubmit"
        >
          确定
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
/* eslint-disable no-unused-vars */
import { importExcel, parseExcel, exportExcel } from '@femessage/excel-it'
import { importTemplateColumns } from './template-columns'
import { APPROPRIATION_STATYS_OPTIONS, COMPANY_TAGS_OPTIONS } from '../../const.js'
import dayjs from 'dayjs'
const ATTENTIONS = `填写须知：
字段填写规范
      企业名称：文本（必填）
      企业联系人/法人：文本（必填）
      企业标签：文本（必填）[可填值为：已放款；已拜访；短期办不了；待跟进；已办理拒绝；可以继续办理；办理中]
      批款情况：文本（必填）[ 格式：银行+批款金额，若有多种情况用英文逗号隔开，银行可选项为：建行；邮政；交行；广发；微众；苏宁；金城；网商]
      所属团队：文本（必填）必须填入系统已创建的团队名称
      电销员：文本（必填）必须填入系统已创建的电销员名称
`
export default {
  name: 'ImportDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    tableData: {
      type: Array,
      default() {
        return []
      }
    },
    userList: {
      type: Array,
      default() {
        return []
      }
    },
    teamList: {
      type: Array,
      default() {
        return []
      }
    },
    columns: {
      type: Array,
      default() {
        return [
          {
            prop: 'company_name',
            label: '企业名称',
            width: '120px'
          },
          {
            prop: 'company_contact_name',
            label: '企业联系人/法人',
            width: '120px'
          },
          // {
          //   prop: 'loan_amount',
          //   label: '放款金额',
          //   width: '120px'
          // },
          {
            prop: 'company_tags',
            label: '企业标签',
            width: '120px'
          },
          {
            prop: 'record',
            label: '跟进记录',
            width: '120px'
          },
          {
            prop: 'appropriation_status',
            label: '批款情况',
            width: '120px'
          },
          {
            prop: 'team',
            label: '所属团队',
            width: '120px'
          },
          {
            prop: 'telemarketer',
            label: '电销员',
            width: '120px'
          }
        ]
      }
    }
  },

  data() {
    return {
      confirmButtonLoading: false,
      importedData: [],
      tableConfig: {
        hasPagination: false,
        hasNew: false,
        hasEdit: false,
        hasDelete: false,
        tableAttrs: {
          'max-height': 250
        },
        extraButtons: [
          {
            text: '移除',
            atClick: row => {
              this.successData.splice(
                this.successData.findIndex(item => item === row),
                1
              )
              return Promise.reject()
            }
          }
        ]
      },
      successData: [],
      errorData: [],
      errorColumns: [...this.columns, {
        prop: 'msg',
        label: '错误信息',
        width: '240px',
        fixed: 'right'
      }]
    }
  },

  watch: {
    importedData: function(data) {
      data.forEach(item => {
        item.msg = ''
        Object.keys(item).forEach(k => {
          if (k === 'company_tags') {
            const data = COMPANY_TAGS_OPTIONS.find(i => i.label === item[k])
            if (!data) {
              item.msg += '企业标签错误；'
              return
            }
          }
          if (k === 'team') {
            const data = this.teamList.find(i => i.label === item[k])
            if (!data) {
              item.msg += '该团队不存在；'
              return
            }
          }
          if (k === 'telemarketer') {
            const data = this.userList.find(i => i.label === item[k])
            if (!data) {
              item.msg += '该电销员不存在；'
              return
            }
          }
          if (k === 'appropriation_status') {
            try {
              item[k].split(',').map(i => {
                const arr = i.split('+')
                return {
                  appropriation_status: APPROPRIATION_STATYS_OPTIONS.find(j => j.label === arr[0]).value,
                  amount: Number(arr[1])
                }
              })
            } catch (error) {
              item.msg += '批款情况格式错误或输入银行错误；'
            }
          }
        })
        if (!item.msg) {
          this.successData.push(item)
        } else {
          this.errorData.push(item)
        }
      })
      if (!data.length) {
        this.successData = []
        this.errorData = []
      }
      this.$refs.table.data = this.successData
      this.$refs.errorTable.data = this.errorData
    },
    visible(val) {
      this.importedData = []
    }
  },
  mounted() {
    // getShopInfoAndChannelInfo(),
  },
  methods: {
    // 导入数据
    handleImportExcel() {
      importExcel(['A1', 'S1'], res => {
        const {columns, data} = res[0]
        if (!data.length) {
          return this.showMessage('导入数据不能为空', 'error')
        }
        const excelData = res[0].data
        this.successData = []
        this.errorData = []
        this.importedData = this.transformMethod(excelData)
      })
    },

    transformMethod(excelData) {
      return excelData.map(item => {
        const obj = {}
        Object.keys(importTemplateColumns).forEach(k => {
          obj[k] = item[importTemplateColumns[k]]
        })
        return obj
      })
    },

    // 下载模板
    handleDownloadTemplate() {
      exportExcel({
        columns: Object.keys(importTemplateColumns).map(k => ({
          prop: k,
          label: importTemplateColumns[k]
        })),
        fileName: '批量导入销售单',
        merges: ['A1', 'S1'],
        header: ATTENTIONS
      })
    },
    handleExportExcel() {
      const columns = importTemplateColumns
      columns.msg = '错误数据'
      exportExcel({
        columns: Object.keys(importTemplateColumns).map(k => ({
          prop: k,
          label: importTemplateColumns[k]
        })),
        data: this.errorData,
        fileName: '错误销售单',
        merges: ['A1', 'S1'],
        header: ATTENTIONS
      })
    },

    handleSubmit() {
      const data = JSON.parse(JSON.stringify(this.successData))
      const importedData = data.map(item => {
        delete item.msg
        
        if (!item.record) {
          item.record = null
        } else {
          item.record = JSON.stringify([
            {
              userId: this.$store.state.user.id,
              createTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
              content: item.record
            }
          ])
        }
        const obj = {}
        Object.keys(item).forEach(k => {
          if (k === 'company_tags') {
            const data = COMPANY_TAGS_OPTIONS.find(i => i.label === item[k])
            if (data) {
              obj[k] = data.value      
            }
            return
          }
          if (k === 'team') {
            const data = this.teamList.find(i => i.label === item[k])
            if (data) {
              obj[k] = data.value
            }
            return
          }
          if (k === 'telemarketer') {
            const data = this.userList.find(i => i.label === item[k])
            if (data) {
              obj[k] = data.value
            }
            return
          }
          if (k === 'appropriation_status') {
            obj[k] = item[k].split(',').map(i => {
              const arr = i.split('+')
              return {
                appropriation_status: APPROPRIATION_STATYS_OPTIONS.find(j => j.label === arr[0]).value,
                amount: Number(arr[1])
              }
            })
            return
          }
          obj[k] = item[k]
        })
        return obj
      })
      this.confirmButtonLoading = true
      this.$api.$post('/api/saleSlips/importSalesSlip', {importedData}).then(() => {
        this.$message.success('导入成功')
        this.$emit('close-dialog')
        this.$emit('success')
        this.successData = []
        this.errorData = []
        this.importedData = []
      }).finally(() => {
        this.confirmButtonLoading = false
      })
    },

    onDialogClose() {
      this.importedData.length = 0
      this.$emit('close-dialog')
    },

    onUploadAreaDrop(e) {
      e.preventDefault()
      parseExcel(e.dataTransfer.files[0], [], data => {
        const excelData = data[0].data
        console.log('[ data ] >', data)

        // this.importedData = this.transformMethod(excelData)
      })
    },

    onUploadAreaDragOver: e => e.preventDefault()
  }
}
</script>

<style lang="scss" scoped>
.import-data {
    text-align: center;
    padding: 30px 20px;
}
.imported-page {
    overflow: hidden;
    .imported-counter {
        margin: 10px 0;
    }
}
.upload-area {
    border-radius: 4px;
    border: dashed #ccc 1px;
    padding: 20px 0;
    .upload-area-icon {
        width: 20px;
    }
    .upload-area-title {
        font-weight: bold;
    }
    &:hover {
        cursor: pointer;
        background-color: rgb(244, 248, 255);
    }
}
</style>
<style lang="scss">
.importDialog {
    .el-table__fixed-right {
        height: 100% !important;
    }
    .el-dialog__body {
        padding: 10px 20px 0;
    }
    .footer {
        // 按钮组

        width: auto;
        margin: 20px -20px;
        display: flex;
        justify-content: center;
    }
}
</style>
