<template>
  <div>
    <!-- 列表页面 -->
    <div class="container" v-show="!showForm">
      <div class="header">
        <div class="header-left">
          <p class="title">书籍列表</p>
        </div>
        <div class="header-right">
          <el-select
            size="small"
            filterable
            default-first-option 
            v-model="book_type"
            placeholder="筛选类别"
            @change="handleChange"
            clearable
            style="width: 100px ;margin-right: 10px"
          >
            <el-option
              v-for="item in book_types"
              :key="Number(item.item_code)"
              :label="item.item_name"
              :value="Number(item.item_code)"
            ></el-option>
          </el-select>
          <lin-search @query="onQueryChange" placeholder="请输入ISBN/书籍名" size="small" />
          <el-button
            type="primary"
            icon="el-icon-plus"
            v-permission="'新增书籍'"
            style="margin-left: 10px"
            @click="
              () => {
                ;(showForm = true), (this.edit_book_id = null)
              }
            "
            >新增</el-button
          >
          <el-button type="default" icon="el-icon-refresh" @click="refresh">刷新</el-button>
          <!-- <el-button icon="el-icon-download" @click="exprotExcel">导出</el-button> -->
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
        <template v-slot:title="scope">
          <span>{{ '《' + scope.row.title + '》' }}{{ scope.row.subtitle }}</span>
        </template>
        <template v-slot:author="scope">
          <span>{{ scope.row.author1 }} {{ scope.row.author_type_name1.replace('者','') }}</span><span v-show="scope.row.author2">{{ '，' + scope.row.author2 }} {{ scope.row.author_type_name2.replace('者','') }}</span><span v-show="scope.row.author3">{{ '，' + scope.row.author3 }} {{ scope.row.author_type_name3.replace('者','') }}</span>
        </template>
        <template v-slot:date_purchased="scope">
          <span>{{ scope.row.date_purchased | filterTime }}</span>
        </template></lin-table
      >
    </div>

    <!-- 编辑页面 -->
    <book-form v-if="showForm" @editClose="editClose" :edit_book_id="edit_book_id"></book-form>
  </div>
</template>


<script>
import book from '@/model/book'
import baseApi from '@/plugin/base/model/base'
import LinTable from '@/component/base/table/lin-table'
import LinSearch from '@/component/base/search/lin-search'
import BookForm from './book-form'
import ParseTime from '@/lin/util/parseTime'

export default {
  components: {
    LinTable,
    LinSearch,
    BookForm,
  },
  data() {
    return {
      tableColumn: [
        { prop: 'book_type_name', label: '书籍类别', width: 150, align: 'center' },
        { prop: 'isbn', label: 'ISBN', width: 180, align: 'center' },
        {
          prop: 'title, subtitle',
          label: '书名',
          scope: 'title',
          scopedSlots: { customRender: 'title' },
        },
        {
          prop: 'author1, author2, author3',
          label: '作者',
          scope: 'author',
          scopedSlots: { customRender: 'author' },
        },
        //{ prop: 'author1', label: '作者', width: 175 },
        {
          prop: 'date_purchased',
          label: '购买日期',
          align: 'center',
          scope: 'date_purchased',
          scopedSlots: { customRender: 'date_purchased' },
          width: 150,
        },
      ],
      tableData: [],
      operate: [],
      showForm: false,
      edit_book_id: 1,
      book_types: [],
      pagination: {
        pageSize: 10,
        pageTotal: 0,
        currentPage: 1, // 默认获取第一页的数据
      },
      book_type: '',
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
        permission: '删除书籍',
      },
    ]
    let arr = await baseApi.getItems({
      typeCode: 'Book.Type',
    })
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].status == 1) {
        this.book_types.push(arr[i])
      }
    }
    await this.getBooks()
  },
  methods: {
    // 下拉框选择分组
    async handleChange() {
      this.pagination.currentPage = 1
      await this.getBooks()
    },
    // 切换table页
    async handleCurrentPageChange(val) {
      this.pagination.currentPage = val
      await this.getBooks()
    },
    async handlePageSizeChange(val) {
      this.pagination.pageSize = val
      await this.getBooks()
    },
    async getBooks() {
      const currentPage = this.pagination.currentPage - 1
      try {
        //this.loading = true
        let res = await book.getBooks({          
          keyword: this.searchKeyword,
          itemType: this.book_type,
          count: this.pagination.pageSize,
          page: currentPage,
        })
        this.tableData = [...res.items]
        this.pagination.pageTotal = res.count
        this.loading = false
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
        this.getBooks()
        return
      }
      this.loading = true
      this.getBooks()
      this.loading = false
    },
    handleEdit(val) {
      console.log('val', val)
      this.showForm = true
      this.edit_book_id = val.row.id
    },
    handleDelete(val) {
      this.$confirm('此操作将永久删除该书籍, 是否继续?', '提示', {
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
    async refresh() {
      await this.getBooks()
      this.$message.success('刷新成功')
    },
    rowClick() {},
    editClose() {
      this.showForm = false
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
