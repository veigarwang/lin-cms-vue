<template>
  <div>
    <div class="container">
      <div class="header">
        <div class="header-left">
          <div class="title">评论管理</div>
        </div>
        <div class="header-right">
          <el-input clearable size="medium" style="margin-right:10px;" v-model="pagination.text" placeholder="评论内容">
          </el-input>
          <el-button type="default" icon="Search" @click="getComments">查询</el-button>
        </div>
      </div>
      <!-- 表格 -->
      <lin-table :tableColumn="tableColumn" :tableData="tableData" :operate="operate" @handleDetail="handleDetail"
        @handleDelete="handleDelete" @row-click="rowClick" v-loading="loading" :pagination="pagination"
        @currentChange="handleCurrentChange">
        <template v-slot:is_audit="scope">
          <el-tag size="medium" v-if="scope.row.is_audit == true" type="success">审核通过</el-tag>
          <el-tag size="medium" v-else type="danger">拉黑</el-tag>
        </template>
        <template v-slot:userinfo="scope">
          <span class="item username clickable" v-if="scope.row.user_info">
            <a :href="'/blog/detail/' + scope.row.user_info.id">{{ scope.row.user_info.nickname }}</a>
          </span>
        </template>
      </lin-table>
    </div>
    <comment-dialog ref="dialogForm" @ok="getComments"></comment-dialog>
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue'
import LinTable from '@/component/base/table/lin-table'
import CommentDialog from './comment-dialog'
import commentApi from '../../model/comment'

export default {
  name: 'CommentList',
  components: { LinTable, CommentDialog },
  inject: ['eventBus'],
  data() {
    return {
      id: 0,
      refreshPagination: true,
      editIndex: null,
      tableData: [],
      tableColumn: [],
      operate: [],
      activeTab: '修改信息',
      loading: false,
      pagination: {
        pageSize: 10,
        pageTotal: 0,
        currentPage: 1,
        text: '',
      },
    }
  },
  methods: {
    async getComments() {
      const currentPage = this.pagination.currentPage - 1
      this.loading = true
      const res = await commentApi
        .getComments({
          count: this.pagination.pageSize,
          page: currentPage,
          text: this.pagination.text,
        })
        .finally(r => {
          this.loading = false
        })
      this.tableData = [...res.items]
      this.pagination.pageTotal = res.total
    },
    buttonMethods(func, index, row) {
      console.log(func, index, row)
    },
    handleDetail(val) {
      let selectedData
      // 单击 编辑按键
      if (val.index >= 0) {
        this.editIndex = val.index
        selectedData = val.row
      } else {
        // 单击 table row
        selectedData = val
      }
      this.$refs['dialogForm'].show(selectedData)
    },
    // 切换table页
    async handleCurrentChange(val) {
      this.pagination.currentPage = val
      this.loading = true
      await this.getComments()
      this.loading = false
    },
    handleDelete(val) {
      let res
      this.$confirm('此操作将永久删除该评论, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.loading = true
          res = await commentApi.delectComment(val.row.id)
        } catch (e) {
          this.loading = false
          console.log(e)
        }
        if (res.code === 0) {
          this.loading = false
          if (this.pagination.pageTotal % this.pagination.pageSize === 1 && this.pagination.currentPage !== 1) {
            this.pagination.currentPage--
          }
          await this.getComments()
          this.$message({
            type: 'success',
            message: `${res.message}`,
          })
        } else {
          this.loading = false
          this.$message.error(`${res.message}`)
        }
      })
    },
    rowClick(row) {
      this.handleDetail(row)
    },
  },
  async created() {
    await this.getComments()
    this.tableColumn = [
      {
        prop: 'userinfo',
        label: '用户',
        scopedSlots: { customRender: 'userinfo' },
      },
      { prop: 'text', label: '评论内容', width: 700 },
      {
        prop: 'is_audit',
        label: '状态',
        scopedSlots: { customRender: 'is_audit' },
      },
      {
        prop: 'create_time',
        label: '创建时间',
        scope: 'create_time',
        customRender(row, column) {
          const { appContext } = getCurrentInstance()
          return appContext.config.globalProperties.$filters.filterTimeYmdHms(column)
        },
      },
    ]

    this.operate = [
      { name: '审核', func: 'handleDetail', type: 'primary', permission: '审核评论' },
      { name: '删除', func: 'handleDelete', type: 'danger', permission: '删除评论' },
    ]
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/list.scss';
</style>
