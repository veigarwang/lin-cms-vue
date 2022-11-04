<template>
  <div>
    <div class="container">
      <div class="header">
        <el-card style="width:100%;" class="margin-bottom-xs margin-top-xs" shadow="never">
          <el-form :inline="true" :model="pagination" class="search-form">
            <el-form-item label="请选择级别">
              <el-select placeholder="请选择级别" v-model="pagination.logLevel" clearable>
                <el-option :label="item.text" :value="item.level" v-bind:key="item.level" v-for="item in logLevels">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="消息">
              <el-input size="medium" style="margin-right:10px;" v-model="pagination.keyword" placeholder="消息"
                clearable></el-input>
            </el-form-item>
            <el-form-item label="时间范围">
              <lin-date-picker @dateChange="handleDateChange" ref="searchDate" class="date"></lin-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="refresh">查询</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
      <!-- 表格 -->
      <lin-table :tableColumn="tableColumn" :tableData="tableData" :operate="operate" v-loading="loading"
        :pagination="pagination" @currentChange="handleCurrentChange" @handleDetail="handleDetail">
        <template v-slot:level="scope">
          <el-tag size="medium" :type="formatlogLevelType(scope.row.level)">{{ formatLogLevels(scope.row.level) }}
          </el-tag>
        </template>
        <template v-slot:timestamp="scope">
          {{ $filters.filterTimeYmdHms(scope.row.timestamp) }}
        </template>
      </lin-table>
    </div>
    <serilog-dialog ref="dialogForm"></serilog-dialog>
  </div>
</template>

<script>
import log from 'lin/model/log'
import LinTable from '@/component/base/table/lin-table'
import LinDatePicker from '@/component/base/date-picker/lin-date-picker'
import SerilogDialog from './serilog-dialog'

var vm
export default {
  name: 'SerilogList',
  components: { LinTable, LinDatePicker, SerilogDialog },
  inject: ['eventBus'],
  data() {
    vm = this
    return {
      id: 0,
      showEdit: false,
      editIndex: null,
      tableData: [],
      tableColumn: [],
      operate: [],
      loading: false,
      pagination: {
        pageSize: 10,
        pageTotal: 0,
        currentPage: 1,
        logLevel: '',
        keyword: '',
      },
      searchDate: [],
      logLevels: [
        {
          level: 0,
          text: 'Trace',
          class: 'default',
        },
        {
          level: 1,
          text: 'Debug',
          class: 'info',
        },
        {
          level: 2,
          text: 'Information',
          class: 'success',
        },
        {
          level: 3,
          text: 'Warning',
          class: 'warning',
        },
        {
          level: 4,
          text: 'Error',
          class: 'danger',
        },
        {
          level: 5,
          text: 'Critical',
          class: 'default',
        },
        {
          level: 6,
          text: 'None',
          class: 'info',
        },
      ],
    }
  },
  methods: {
    formatLogLevels(level) {
      if (level < vm.logLevels.length) {
        return vm.logLevels[level].text
      } else {
        return 'none'
      }
    },
    formatlogLevelType(level) {
      if (level < vm.logLevels.length) {
        return vm.logLevels[level].class
      } else {
        return 'info'
      }
    },
    handleDateChange(date) {
      this.searchDate = date
    },
    async getSerilogs() {
      this.loading = true
      var params = {
        count: this.pagination.pageSize,
        page: this.pagination.currentPage - 1,
        logLevel: this.pagination.logLevel,
        keyword: this.pagination.keyword,
      }
      if (this.searchDate) {
        params.start = this.searchDate[0]
        params.end = this.searchDate[1]
      }
      const res = await log.getSerilogListAsync(params).finally(r => {
        this.loading = false
      })
      this.tableData = [...res.items]
      this.pagination.pageTotal = res.total
    },
    async handleCurrentChange(val) {
      this.pagination.currentPage = val
      this.loading = true
      await this.getSerilogs()
      this.loading = false
    },
    async refresh() {
      await this.getSerilogs()
    },
    async handleDetail(val) {
      this.$refs['dialogForm'].show(val.row)
    },
  },
  async created() {
    this.tableColumn = [
      {
        prop: 'level',
        label: '级别',
        scopedSlots: { customRender: 'level' },
        width: 150,
      },
      {
        prop: 'message',
        label: '信息',
      },
      {
        prop: 'timestamp',
        label: '创建时间',
        width: 250,
        scopedSlots: { customRender: 'timestamp' },
      },
    ]
    this.operate = [{ name: '查看', func: 'handleDetail', type: 'primary', permission: 'Serilog日志' }]

    await this.getSerilogs()
  },
  beforeDestroy() { },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/list.scss';


</style>
