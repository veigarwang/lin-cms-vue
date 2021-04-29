<template>
  <div>
    <!-- 列表页面 -->
    <div class="container" v-if="!showEdit">
      <div class="header">
        <div class="title">图书列表</div>
        <!-- 分组选择下拉框 -->
        <div class="header-right">
          <div style="margin-left:30px">
            <el-button type="default" icon="el-icon-search" @click="getBooks">刷新</el-button>

           <el-button @click="exprotExcel">导出</el-button>
        </div>
      </div>
      <!-- 表格 -->
      <lin-table
        :tableColumn="tableColumn"
        :tableData="tableData"
        :operate="operate"
        @handleEdit="handleEdit"
        @handleDelete="handleDelete"
        @row-click="rowClick"
        v-loading="loading"
        :pagination="pagination"
        @currentChange="handleCurrentChange"
      ></lin-table>
    </div>

    <!-- 编辑页面 -->
    <book-modify v-else @editClose="editClose" :editBookID="editBookID"></book-modify>
  </div>
</template>

<script>
import book from '@/model/book'
import LinTable from '@/component/base/table/lin-table'
import BookModify from './book-modify'
import ParseTime from '@/lin/util/parseTime'

export default {
  components: {
    LinTable,
    BookModify,
  },
  data() {
    return {
      tableColumn: [
        { prop: 'title', label: '书名' },
        { prop: 'author', label: '作者' },
      ],
      tableData: [],
      operate: [],
      showEdit: false,
      editBookID: 1,
      pagination: {
        pageSize: 10,
        pageTotal: 0,
        currentPage: 1, // 默认获取第一页的数据
      },
    }
  },
  async created() {
    this.operate = [
      { name: '编辑', func: 'handleEdit', type: 'primary' },
      {
        name: '删除',
        func: 'handleDelete',
        type: 'danger',
        permission: '删除图书',
      },
    ]
    await this.getBooks()
    this.loading = false
  },
  methods: {
    // 切换table页
    async handleCurrentChange(val) {
      this.pagination.currentPage = val
      await this.getBooks()
    },
    async getBooks() {
      const currentPage = this.pagination.currentPage - 1
      try {
        this.loading = true
        let res = await book.getBooks({
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
    handleEdit(val) {
      console.log('val', val)
      this.showEdit = true
      this.editBookID = val.row.id
    },
    handleDelete(val) {
      this.$confirm('此操作将永久删除该图书, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await book.deleteBook(val.row.id)
        if (res.code < window.MAX_SUCCESS_CODE) {
          this.getBooks()
          this.$message({
            type: 'success',
            message: `${res.message}`,
          })
        }
      })
    },
    rowClick() {},
    editClose() {
      this.showEdit = false
      this.getBooks()
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
      return this.tableData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return ParseTime(v[j])
        }
        return v[j]
      }),)
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

    .title {
      height: 59px;
      line-height: 59px;
      color: $parent-title-color;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
}
</style>
