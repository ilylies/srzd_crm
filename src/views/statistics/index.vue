<template>
  <div class="index">
    <div class="content-left">
      <div class="schedule">
        <p class="title">放款总计</p>
        <div class="block">
          <el-date-picker
            v-model="totalPicker"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            @change="getSalesTotalByTime"
          />
        </div>
        <ul class="card__wrapper">
          <li v-for="(item, i) in totalList" :key="i" class="card__item">
            <div class="card__item__wrapper">
              <img
                :src="require(`./images/${item.icon}`)"
                class="card__item__logo"
              >
              <div class="card__item__detail">
                <CountTo :start-val="0" :end-val="item.value" :duration="1500" class="card__item__number" />
                <p class="card__item__status">{{ item.statusName }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="team">
        <p class="title">团队放款</p>
        <div class="block">
          <el-date-picker
            v-model="teamPicker"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            style="margin: 0 16px 16px 0;"
            @change="changeTeamOrUser(1)"
          />
          <el-select v-model="selectedTeam" placeholder="请选择团队" @change="changeTeamOrUser(1, true)">
            <el-option
              v-for="item in teamList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <ul class="card__wrapper">
          <li v-for="(item, i) in totalTeamList" :key="i" class="card__item">
            <div class="card__item__wrapper">
              <img
                :src="require(`./images/${item.icon}`)"
                class="card__item__logo"
              >
              <div class="card__item__detail">
                <CountTo :start-val="0" :end-val="item.value" :duration="1000" class="card__item__number" />
                <p class="card__item__status">{{ item.statusName }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="telemarketer">
        <p class="title">电销员放款</p>
        <div class="block">
          <el-date-picker
            v-model="userPicker"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            style="margin: 0 16px 16px 0;"
            @change="changeTeamOrUser(2)"
          />
          <el-select v-model="selectedUser" placeholder="请选择电销员" :duration="1000" @change="changeTeamOrUser(2, true)">
            <el-option
              v-for="item in userList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <ul class="card__wrapper">
          <li v-for="(item, i) in totalUserList" :key="i" class="card__item">
            <div class="card__item__wrapper">
              <img
                :src="require(`./images/${item.icon}`)"
                class="card__item__logo"
              >
              <div class="card__item__detail">
                <CountTo :start-val="0" :end-val="item.value" :duration="1000" class="card__item__number" />
                <p class="card__item__status">{{ item.statusName }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import CountTo from 'vue-count-to'
export default {
  name: 'Index',
  components: {
    CountTo
  },
  data() {
    return {
      totalPicker: [dayjs(new Date()).format('YYYY-MM-DD'), dayjs(new Date()).format('YYYY-MM-DD')],
      teamPicker: [dayjs(new Date()).format('YYYY-MM-DD'), dayjs(new Date()).format('YYYY-MM-DD')],
      userPicker: [dayjs(new Date()).format('YYYY-MM-DD'), dayjs(new Date()).format('YYYY-MM-DD')],
      selectedTeam: '',
      selectedUser: '',
      userList: [],
      teamList: [],
      totalList: [
        {
          prop: 'customTotal',
          icon: 'fenhuo.png',
          statusName: '自定义时间段放款',
          value: 0
        },
        {
          prop: 'daysTotal',
          icon: 'yuce.png',
          statusName: '当日放款',
          value: 0
        },
        {
          prop: 'weekTotal',
          icon: 'buhuo.png',
          statusName: '当周放款',
          value: 0
        },
        {
          prop: 'monthTotal',
          icon: 'queren.png',
          statusName: '当月放款',
          value: 0
        }
      ],
      totalTeamList: [
        {
          prop: 'customTotal',
          icon: 'fenhuo.png',
          statusName: '自定义时间段放款',
          value: 0
        },
        {
          prop: 'daysTotal',
          icon: 'yuce.png',
          statusName: '当日放款',
          value: 0
        },
        {
          prop: 'weekTotal',
          icon: 'buhuo.png',
          statusName: '当周放款',
          value: 0
        },
        {
          prop: 'monthTotal',
          icon: 'queren.png',
          statusName: '当月放款',
          value: 0
        }
      ],
      totalUserList: [
        {
          prop: 'customTotal',
          icon: 'fenhuo.png',
          statusName: '自定义时间段放款',
          value: 0
        },
        {
          prop: 'daysTotal',
          icon: 'yuce.png',
          statusName: '当日放款',
          value: 0
        },
        {
          prop: 'weekTotal',
          icon: 'buhuo.png',
          statusName: '当周放款',
          value: 0
        },
        {
          prop: 'monthTotal',
          icon: 'queren.png',
          statusName: '当月放款',
          value: 0
        }
      ],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  mounted() {
    this.getSalesTotal()
    this.getSalesTotalByTime()
    this.getUsersByLevel()
    this.getTeamList()
  },
  methods: {
    getSalesTotal(team, userId) {
      this.$api.$get('/api/saleSlips/selectSalesTotal', {params: { team, userId}}).then(({payload}) => {
        if (team) {
          this.totalTeamList.forEach(i => {
            if (i.prop !== 'customTotal') {
              i.value = payload[i.prop] || 0
            }
          })
          return 
        }
        if (userId) {
          this.totalUserList.forEach(i => {
            if (i.prop !== 'customTotal') {
              i.value = payload[i.prop] || 0
            }
          })
          return
        }
        this.totalList.forEach(i => {
          if (i.prop !== 'customTotal') {
            i.value = payload[i.prop] || 0
          }
        })

      })
    },
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
    getSalesTotalByTime(team, userId) {
      this.$api.$get('/api/saleSlips/selectSalesTotalByTime', {params: {startTime: team ? this.teamPicker[0] : userId ? this.userPicker[0] : this.totalPicker[0], endTime: team ? this.teamPicker[1] : userId ? this.userPicker[1] : this.totalPicker[1], team, userId}}).then(({payload}) => {       
        if (team) {
          this.totalTeamList[0].value = payload.total || 0
          return 
        }
        if (userId) {
          this.totalUserList[0].value = payload.total || 0
          return
        }
        this.totalList[0].value = payload.total || 0
      })
    },
    changeTeamOrUser(type, isTrue) {
      if (type === 1) {
        isTrue && this.getSalesTotal(this.selectedTeam)
        this.selectedTeam && this.getSalesTotalByTime(this.selectedTeam)
      } else {
        isTrue && this.getSalesTotal(null, this.selectedUser)
        this.selectedUser && this.getSalesTotalByTime(null, this.selectedUser)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.index {
    height: 100%;
    background-size: 100%, auto;
    background-repeat: no-repeat;
    display: flex;
    padding: 0 2%;
    .title {
        color: #2d303b;
        margin: 10px 0 16px;
        font-weight: 600;
    }
    .content-left {
        width: 100%;
        margin: auto;
        overflow: hidden;
        > div {
            margin-bottom: 20px;
        }
        .card__wrapper {
            display: flex;
            flex-wrap: wrap;
            .card {
                &__item {
                    width: 25%;
                    min-width: 180px;
                    box-sizing: border-box;
                    cursor: pointer;
                    margin-bottom: 10px;
                    &__wrapper {
                        height: 100%;
                        display: flex;
                        background: #fff;
                        border-radius: 10px;
                        padding: 17px 16px;
                        border: 1px solid #eceded;
                        margin: 0 20px 10px 0;
                        position: relative;
                        &__hover {
                            display: none;
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            margin: auto;
                            padding: 17px 16px;
                            background: rgba(40, 120, 255, 1);
                            border-radius: 10px;
                            opacity: 0.9;
                            text-align: center;
                            color: #fff;
                            font-size: 14px;
                            p {
                                margin-bottom: 8px;
                                line-height: 20px;
                            }
                            .icon {
                                width: 6px;
                                height: 12px;
                                margin-left: 6px;
                            }
                        }
                        &:hover .card__item__wrapper__hover {
                            display: block;
                        }
                    }
                    &__logo {
                        width: 26px;
                        height: 26px;
                        margin-right: 10px;
                        margin-top: 8px;
                    }
                    &__detail {
                        flex: 1;
                    }
                    &__number {
                        font-size: 28px;
                        font-weight: bold;
                        color: rgba(45, 48, 59, 1);
                        margin-bottom: 10px;
                    }
                    &__status {
                        // font-size: @--font-size-small;
                        font-weight: 400;
                        color: rgba(129, 131, 137, 1);
                    }
                }
            }
        }
        .convenient-menu {
            flex: 1;
            box-sizing: border-box;
            ul {
                padding: 5px 0;
            }
            li {
                float: left;
                width: 10%;
                text-align: center;
                cursor: pointer;
                padding: 10px 0;
                margin-bottom: 15px;
                .icon {
                    width: 28px;
                    height: 28px;
                    margin-bottom: 10px;
                }
                p {
                    font-size: 14px;
                    font-weight: 400;
                    color: rgba(45, 48, 59, 1);
                }
            }
        }
    }
    .content-right {
        flex: 1;
        padding-top: 47px;
        overflow: hidden;
        & > div {
            padding: 16px;
            border-radius: 10px;
            border: 1px solid #eceded;
            margin-bottom: 20px;
        }
        .message-wrapper {
            .title {
                display: flex;
                justify-content: space-between;
                align-items: center;
                .icon {
                    width: 8px;
                    height: 14px;
                    margin-left: 6px;
                }
            }
            .message-list__item {
                font-size: 12px;
                color: #2d303b;
                padding-bottom: 12px;
                margin-bottom: 12px;
                border-bottom: 1px solid #e4e8f3;
                &_title {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 6px;
                }
                &_time {
                    color: #818389;
                }
                &_des {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
        .wx-code {
            .code-content {
                display: flex;
                justify-content: space-around;
                align-items: center;
                flex-wrap: wrap;
            }
            .code-content_left {
                text-align: center;
                .deepexi {
                    font-size: 16px;
                    color: #2d303b;
                }
            }
            .code-content_right {
                width: 50%;
                min-width: 200px;
                min-height: 120px;
                display: flex;
                justify-content: center;
                align-items: center;
                background: url('./images/qrcode_bg.png');
                img {
                    width: 100px;
                }
            }
        }
    }
}
</style>
