<template>
  <div>
    <!-- 列表页面 -->
    <div class="container" v-show="!showForm">
      <sticky-top>
        <div class="header">
          <div class="header-left">
            <p class="title">书籍列表</p>
          </div>
          <div class="header-right">
            <el-select
              size="small"
              v-model="book_type"
              filterable
              placeholder="筛选类别"
              @change="handleChange"
              clearable
              style="width: 100px; margin-left: 10px"
            >
              <el-option
                v-for="item in book_types"
                :key="Number(item.item_code)"
                :label="item.item_name"
                :value="Number(item.item_code)"
              ></el-option>
            </el-select>
            <lin-search
              @query="onQueryChange"
              placeholder="请输入ISBN/书籍名/作者名"
              size="small"
              width="180"
              style="margin-left: 10px"
            />
            <el-switch
              v-model="exactMatch"
              @change="onQueryChange"
              active-color="#3963bc"
              active-text="精确查询"
              inactive-text=""
              style="margin-left: 10px"
            />
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
      </sticky-top>
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
          <span>{{ scope.row.title }}{{ scope.row.subtitle }}</span>
        </template>
        <template v-slot:author="scope">
          <span>{{ scope.row.author1 }} {{ scope.row.author_type_name1.replace('者', '') }}</span
          ><span v-if="scope.row.author2"
            >{{ '，' + scope.row.author2 }} {{ scope.row.author_type_name2.replace('者', '') }}</span
          ><span v-if="scope.row.author3"
            >{{ '，' + scope.row.author3 }} {{ scope.row.author_type_name3.replace('者', '') }}</span
          >
        </template>
        <template v-slot:shelf_location="scope">
          <span>{{ scope.row.shelf_location }}</span>
        </template>
        <template v-slot:is_read="scope"> <el-checkbox v-model="scope.row.is_read" disabled></el-checkbox> </template
      ></lin-table>
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
        { prop: 'book_type_name', label: '书籍类别', width: 90, align: 'center' },
        { prop: 'isbn', label: 'ISBN', width: 140, align: 'center' },
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
        {
          prop: 'shelf_location',
          label: '书架位置',
          align: 'center',
          scope: 'shelf_location',
          scopedSlots: { customRender: 'shelf_location' },
          width: 80,
        },
        {
          prop: 'is_read',
          label: '已读',
          align: 'center',
          scope: 'is_read',
          scopedSlots: { customRender: 'is_read' },
          width: 50,
        },
      ],
      tableData: [],
      operate: [],
      loading: false,
      showForm: false,
      edit_book_id: 1,
      book_types: [],
      location_options: [],
      pagination: {
        pageSize: 10,
        pageTotal: 0,
        currentPage: 1, // 默认获取第一页的数据
      },
      book_type: '',
      searchKeyword: '',
      exactMatch: false,
    }
  },
  async created() {
    this.loading = true
    this.operate = [
      { name: '编辑', func: 'handleEdit', type: 'primary', permission: '更新书籍' },
      {
        name: '删除',
        func: 'handleDelete',
        type: 'danger',
        permission: '删除书籍',
      },
    ]
    await this.getBookTypes()
    await this.getBooks()
    this.loading = false
  },
  methods: {
    // 下拉框选择分组
    async handleChange() {
      this.loading = true
      this.pagination.currentPage = 1
      await this.getBooks()
      this.loading = false
    },
    // 切换table页
    async handleCurrentPageChange(val) {
      this.loading = true
      this.pagination.currentPage = val
      await this.getBooks()
      this.loading = false
    },
    async handlePageSizeChange(val) {
      this.loading = true
      this.pagination.pageSize = val
      await this.getBooks()
      this.loading = false
    },
    async getBookTypes() {
      const arr = await baseApi.getItems({
        typeCode: 'Book.Type',
      })
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].status == 1) {
          this.book_types.push(arr[i])
        }
      }
    },
    async getBooks() {
      const currentPage = this.pagination.currentPage - 1
      try {
        let res = await book.getBooks({
          keyword: this.searchKeyword,
          itemType: this.book_type,
          exactMatch: this.exactMatch,
          count: this.pagination.pageSize,
          page: currentPage,
        })
        this.tableData = [...res.items]
        this.pagination.pageTotal = res.count
      } catch (error) {
        if (error.code === 10020) {
          this.tableData = []
        }
      }
    },
    // 搜索
    async onQueryChange(query) {
      this.loading = true
      if (typeof query === 'string') this.searchKeyword = query.replace(' ', '').trim()
      this.pagination.currentPage = 1
      await this.getBooks()
      this.loading = false
    },
    handleEdit(val) {
      this.showForm = true
      this.edit_book_id = val.row.id
    },
    handleDelete(val) {
      this.$confirm(
        '此操作将永久删除书籍：《' + val.row.title + (val.row.subtitle ? val.row.subtitle : '') + '》，是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        },
      ).then(async () => {
        this.loading = true
        const res = await book.deleteBook(val.row.id)
        this.loading = false
        if (res.code < window.MAX_SUCCESS_CODE) {
          await this.getBooks()
          this.$message({
            type: 'success',
            message: `${res.message}`,
          })
        }
      })
      // .finally(() => {
      //     this.loading = false
      //   })
    },
    async refresh() {
      this.loading = true
      await this.getBookTypes()
      await this.getBooks()
      this.$message.success('刷新成功')
      this.loading = false
    },
    rowClick() {},
    async editClose() {
      this.loading = true
      this.showForm = false
      await this.getBooks()
      this.loading = false
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
@import '@/assets/style/list.scss';
.lin-table {
  /deep/ .el-checkbox,
  /deep/ .el-checkbox.is-disabled,
  /deep/ .el-checkbox__input,
  /deep/ .el-checkbox__input.is-disabled,
  /deep/ .el-checkbox__inner,
  /deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
    cursor: default;
  }
  /deep/ .el-checkbox__input.is-disabled .el-checkbox__inner {
    background-color: white;
    border: 1px solid rgb(196, 192, 210);
  }
  /deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    background: #3963bc;
    border: 1px solid #3963bc;
  }
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin: 20px;
}
</style>
