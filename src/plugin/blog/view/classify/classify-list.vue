<template>
  <div>
    <div class="container"
      v-if="!showEdit">
      <div class="header">
        <div class="header-left">
          <div class="title">分类专栏列表</div>
        </div>
        <div class="header-right">
          <el-input size="medium"
            style="margin-right:10px;"
            v-model="pagination.classify_name"
            placeholder="分类专栏"></el-input>
          <el-button type="default"
            icon="Search"
            @click="refresh">查询</el-button>
        </div>
      </div>
      <!-- 表格 -->
      <lin-table :tableColumn="tableColumn"
        :tableData="tableData"
        :operate="operate"
        @handleEdit="handleEdit"
        @handleDelete="handleDelete"
        v-loading="loading"
        :pagination="pagination"
        @currentChange="handleCurrentChange">
        <template v-slot:thumbnail_display="scope">
          <div class="thumb"
            :style="'background-image: url(' + scope.row.thumbnail_display + ');'"></div>
        </template>
        <template v-slot:create_time="scope">
          <span>{{ $filters.filterTimeYmdHms(scope.row.create_time) }}</span>
        </template>
      </lin-table>
      <!--表格结束-->
    </div>
    <classify-form v-else
      @editClose="editClose"
      :id="id"></classify-form>
  </div>
</template>

<script>
import LinTable from '@/component/base/table/lin-table'
import classifyApi from '../../model/classify'
import ClassifyForm from './classify-form'

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
    async getClassifies() {
      this.loading = true
      const currentPage = this.pagination.currentPage - 1
      const res = await classifyApi
        .getClassifies({
          count: this.pagination.pageSize,
          page: currentPage,
          classify_name: this.pagination.classify_name,
        })
        .finally(r => {
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
      await this.getClassifies()
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
        if (res.code === 0) {
          this.loading = false
          await this.getClassifies()

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
    async refresh() {
      await this.getClassifies()
    },
    // 下拉框选择分组
    async handleChange() {
      this.currentPage = 1
      this.loading = true
      await this.getClassifies()
      this.loading = false
    },

    async editClose() {
      this.showEdit = false
      await this.getClassifies()
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
        scopedSlots: { customRender: 'create_time' },
      },
    ]
    this.operate = [{ name: '删除', func: 'handleDelete', type: 'danger', permission: '删除标签' }]

    await this.getClassifies()
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/list.scss';
</style>
