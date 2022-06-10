<template>
  <div>
    <!-- 列表页面 -->
    <div class="container" v-show="!showForm">
      <div class="header">
        <div class="header-left">
          <p class="title">词条列表</p>
        </div>
        <div class="header-right">
          <lin-search @query="onQueryChange" placeholder="请输入词条名" />
          <el-button
            type="primary"
            icon="el-icon-plus"
            v-permission="'新增词条'"
            style="margin-left: 10px"
            @click="
              () => {
                ;(showForm = true), (this.edit_item_id = null)
              }
            "
            >新增</el-button
          >
          <el-button type="default" icon="el-icon-refresh" @click="refresh">刷新</el-button>
          <el-button icon="el-icon-download" @click="exprotExcel">导出</el-button>
        </div>
      </div>
      <!-- 表格 -->
      <lin-table
        :tableColumn="tableColumn"
        :tableData="tableData"
        :operate="operate"
        :pagination="pagination"
        @handleEdit="handleEdit"
        @handleDelete="handleDelete"
        @currentChange="handleCurrentPageChange"
        @sizeChange="handlePageSizeChange"
        @row-click="rowClick"
        v-loading="loading"
      >
        <!-- <template v-slot:title="scope">
          <span>{{ '《' + scope.row.title + '》' }}{{ scope.row.subtitle }}</span>
        </template>
        <template v-slot:date_purchased="scope">
          <span>{{ scope.row.date_purchased | filterTime }}</span>
        </template> -->
      </lin-table>
    </div>

    <!-- 编辑页面 -->
    <encyclopedia-form
      v-if="showForm"
      @editClose="editClose"
      :edit_item_id="edit_item_id"
      :last_provenance="last_provenance"
    ></encyclopedia-form>
  </div>
</template>

<script>
import encyclopedia from '@/model/encyclopedia'
import LinTable from '@/component/base/table/lin-table'
import LinSearch from '@/component/base/search/lin-search'
import EncyclopediaForm from './encyclopedia-form'
import ParseTime from '@/lin/util/parseTime'

export default {
  components: {
    LinTable,
    LinSearch,
    EncyclopediaForm,
  },
  data() {
    return {
      tableColumn: [
        { prop: 'item_type_name', label: '所属类别', align: 'center', width: '150px' },
        { prop: 'name', label: '词条名称' },
        { prop: 'pronunciation', label: '读音' },
        { prop: 'alias', label: '别名' },
        { prop: 'provenance', label: '出处' },
        { prop: 'effect', label: '作用' },
      ],
      tableData: [],
      operate: [],
      showForm: false,
      edit_item_id: 1,
      last_provenance: '',
      pagination: {
        pageSize: 10,
        pageTotal: 0,
        currentPage: 1, // 默认获取第一页的数据
      },
      searchKeyword: '',
    }
  },
  async created() {
    this.loading = true
    this.operate = [
      { name: '编辑', func: 'handleEdit', type: 'primary' },
      {
        name: '删除',
        func: 'handleDelete',
        type: 'danger',
        permission: '删除词条',
      },
    ]
    await this.getEncyclopedias()
    this.loading = false
    this.last_provenance = this.tableData[0].provenance
  },
  methods: {
    // 切换table页
    async handleCurrentPageChange(val) {
      this.pagination.currentPage = val
      await this.getEncyclopedias(this.searchKeyword)
    },
    async handlePageSizeChange(val) {
      this.pagination.pageSize = val
      await this.getEncyclopedias(this.searchKeyword)
    },
    async getEncyclopedias(val) {
      const currentPage = this.pagination.currentPage - 1
      try {
        this.loading = true
        let res = await encyclopedia.getEncyclopedias({
          keyword: val,
          count: this.pagination.pageSize,
          page: currentPage,
        })
        this.loading = false
        this.tableData = [...res.items]
        this.pagination.pageTotal = res.total
      } catch (error) {
        if (error.code === 10020) {
          this.tableData = []
        }
      }
    },
    // 搜索
    onQueryChange(query) {
      this.searchKeyword = query.trim()
      if (!query) {
        this.getEncyclopedias()
        return
      }
      this.loading = true
      this.getEncyclopedias(this.searchKeyword)
      this.loading = false
    },
    handleEdit(val) {
      console.log('val', val)
      this.showForm = true
      this.edit_item_id = val.row.id
    },
    handleDelete(val) {
      this.$confirm('此操作将永久删除该词条, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await encyclopedia.deleteEncyclopedia(val.row.id)
        if (res.code < window.MAX_SUCCESS_CODE) {
          this.getEncyclopedias(this.searchKeyword)
          this.$message({
            type: 'success',
            message: `${res.message}`,
          })
        }
      })
    },
    async refresh() {
      await this.getEncyclopedias(this.searchKeyword)
      this.$message.success('刷新成功')
    },
    rowClick() {},
    editClose() {
      this.showForm = false
      this.getEncyclopedias(this.searchKeyword)
    },
    // 导出表格
    exprotExcel() {
      // 动态导入
      import('@/lin/util/exportExcel').then(excel => {
        const tHeader = ['timestamp', 'title', 'label', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'label', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list',
        })
      })
    },
    // 将表单格式化为json数据
    formatJson(filterVal) {
      return this.tableData.map(v =>
        filterVal.map(j => {
          if (j === 'timestamp') {
            return ParseTime(v[j])
          }
          return v[j]
        }),
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #dae1ed;

    .header-left {
      float: left;

      .title {
        height: 59px;
        line-height: 59px;
        color: $parent-title-color;
        font-size: 16px;
        font-weight: 500;
      }
    }

    .header-right {
      float: right;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
}
</style>
