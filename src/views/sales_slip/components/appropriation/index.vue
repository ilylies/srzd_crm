<template>
  <div class="appropriation-status">
    <el-edit-table ref="form" v-model="data" :readonly="readonly" :columns="columns" style="width: 100%;" />
  </div>
</template>

<script>
import {APPROPRIATION_STATYS_OPTIONS} from '../../const'
import { numberPattern } from '@/util/pattern'
export default {
  components: {},
  props: {
    values: {
      type: Array,
      defalut: []
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      data: [],
      columns: [
        {
          type: 'select',
          id: 'appropriation_status',
          label: '银行',
          options: APPROPRIATION_STATYS_OPTIONS,
          rules: [
            {
              required: true,
              message: '请选择银行',
              trigger: 'blur'
            }
          ]
        },
        {
          id: 'amount',
          label: '放款金额',
          type: 'input',
          el: {placeholder: '输入放款金额'},
          rules: [
            {
              required: true,
              validator: (rule, value, callback) => {
                if (!value && Number(value) !== 0) {
                  callback(new Error('请输入放款金额'))
                } else {
                  if (!numberPattern.test(value)) {
                    return callback(new Error('请输入数字'))
                  }
                  callback()
                }
              },
              trigger: 'blur'
            }
          ]
        }
      ]
    }
  },

  computed: {},

  watch: {
    values: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val && val.length) {
          this.data = val
        } else {
          this.data = []
        }
      }
    },
    readonly: {
      immediate: true,
      handler(val) {
        console.log('[ val ] >', val)
      }
    }
  },

  mounted() {
    
  },

  methods: {
    validate() {
      return new Promise(resolve => {
        this.$refs.form.validate(valid => {
          resolve(valid ? this.$refs.form.value : false)
        })
      })
    }
  }
}

</script>
<style lang="scss">
.appropriation-status {
    width: 100%;
    display: flex;
    .has-gutter {
        th {
            padding: 0;
        }
    }
}
</style>