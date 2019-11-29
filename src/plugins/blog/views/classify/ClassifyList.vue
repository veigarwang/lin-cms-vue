<template>
  <div>
    <div class="container" v-if="!showEdit">
      <div class="header">
        <div class="header-left">
          <div class="title">分类专栏列表</div>
        </div>

        <div class="header-right">
          <el-input
            size="medium"
            style="margin-right:10px;"
            v-model="pagination.classify_name"
            placeholder="分类专栏"
          ></el-input>
          <el-button type="default" icon="el-icon-search" @click="refresh">查询</el-button>
        </div>
      </div>
      <!-- 表格 -->
      <lin-table
        :tableColumn="tableColumn"
        :tableData="tableData"
        :operate="operate"
        @handleEdit="handleEdit"
        @handleDelete="handleDelete"
        v-loading="loading"
        :pagination="pagination"
        @currentChange="handleCurrentChange"
      >
        <template v-slot:thumbnail_display="scope">
          <div class="thumb" :style="'background-image: url('+scope.row.thumbnail_display+');'"></div>
        </template>
      </lin-table>
      <!--表格结束-->
    </div>
    <classify-form v-else @editClose="editClose" :id="id"></classify-form>
  </div>
</template>

<script>
import classifyApi from '../../models/classify'
import LinTable from '@/components/base/table/lin-table'
import ClassifyForm from './ClassifyForm'
import Vue from 'vue'
export default {
  name: 'ClassifyList',
  components: { LinTable, ClassifyForm },
  inject: ['eventBus'],
  data() {
    return {
      id: 0,
      showEdit: false,
      editIndex: null, // 编辑的行
      tableData: [], // 表格数据
      tableColumn: [], // 表头数据
      operate: [], // 表格按键操作区
      loading: false,
      pagination: {
        pageSize: 10,
        pageTotal: 0,
        currentPage: 1, // 默认获取第一页的数据
        classify_name: '',
      },
    }
  },
  methods: {
    async getClassifys() {
      this.loading = true
      const currentPage = this.pagination.currentPage - 1
      let res = await classifyApi
        .getClassifys({
          count: this.pagination.pageSize,
          page: currentPage,
          classify_name: this.pagination.classify_name,
        })
        .finally((r) => {
          this.loading = false
        })
      this.tableData = [...res.items]
      this.pagination.pageTotal = res.total
    },
    async handleEdit(val) {
      this.showEdit = true
      this.id = val.row.id
    },
    // 切换table页
    async handleCurrentChange(val) {
      this.pagination.currentPage = val
      this.loading = true
      await this.getTags()
      this.loading = false
    },
    handleDelete(val) {
      let res
      this.$confirm('此操作将永久删除该分类专栏项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.loading = true
          res = await classifyApi.deleteClassify(val.row.id)
        } catch (e) {
          this.loading = false
        }
        if (res.error_code === 0) {
          this.loading = false
          await this.getClassifys()

          this.$message({
            type: 'success',
            message: `${res.msg}`,
          })
        } else {
          this.loading = false
          this.$message.error(`${res.msg}`)
        }
      })
    },
    async refresh() {
      await this.getClassifys()
    },
    // 下拉框选择分组
    async handleChange() {
      this.currentPage = 1
      this.loading = true
      await this.getClassifys()
      this.loading = false
    },

    async editClose() {
      this.showEdit = false
      await this.getClassifys()
    },
  },
  async created() {
    this.tableColumn = [
      { prop: 'classify_name', label: '分类专栏' },
      {
        prop: 'thumbnail_display',
        label: '封面',
        scopedSlots: { customRender: 'thumbnail_display' },
      },
      { prop: 'sort_code', label: '排序码' },
      {
        prop: 'create_time',
        label: '创建时间',
        scope: 'create_time',
        customRender: function(row, column) {
          return Vue.filter('filterTimeYmdHms')(column)
        },
      },
    ]
    this.operate = [
      { name: '删除', func: 'handleDelete', type: 'danger', auth: '删除标签' },
    ]

    await this.getClassifys()
  },
  beforeDestroy() {},
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/list.scss';
</style>
