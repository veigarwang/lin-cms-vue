<template>
  <div>
    <!-- 列表页面 -->
    <div class="container" v-if="!showEdit">
      <div class="header">
        <div class="title">图书列表</div>
            <!-- 分组选择下拉框 -->
      <div class="header-right">
        <div style="margin-left:30px">
          <el-button type="default" icon="el-icon-search" @click="getTest">刷新Test</el-button>
        </div>
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
import test from '@/model/test'
import LinTable from '@/component/base/table/lin-table'
import BookModify from './book-modify'

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
        const res = await book.delectBook(val.row.id)
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
   async getTest(){
      let res= await test.getTest();
      // console.log(res)
      // this.$message(res);
    }
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
