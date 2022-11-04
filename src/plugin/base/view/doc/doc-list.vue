<template>
  <div>
    <div class="container" v-if="!showEdit">
      <div class="header">
        <div class="header-left">
          <div class="title">文档</div>
        </div>
        <div class="header-right">
          <el-button type="primary" icon="Edit" v-permission="'新增文档'" @click="() => {
            this.showEdit = true;
            this.id = 0;
          }">新增文档</el-button>
          <el-button type="default" @click="refresh" icon="Search">
            刷新</el-button>
        </div>
      </div>
      <!-- 表格 -->
      <lin-table :tableColumn="tableColumn" :tableData="tableData" :operate="operate" :operateWidth="230"
        @handleEdit="handleEdit" @handleDelete="handleDelete" v-loading="loading" :pagination="pagination"
        @currentChange="handleCurrentChange">
      </lin-table>
      <!--表格结束-->
    </div>
    <doc-form v-else :id="id" ref="docForm" @editClose="editClose"></doc-form>
  </div>
</template>

<script>
import docApi from '../../model/doc'
import LinTable from '@/component/base/table/lin-table'
import DocForm from './doc-form'
export default {
  name: 'DocList',
  components: { LinTable, DocForm },
  inject: ['eventBus'],
  data() {
    return {
      id: 0,
      showEdit: false,
      tableData: [], // 表格数据
      tableColumn: [], // 表头数据
      operate: [], // 表格按键操作区
      loading: false,
      pagination: {
        pageSize: 10,
        pageTotal: 0,
        currentPage: 1, // 默认获取第一页的数据
      },
    }
  },
  methods: {
    async getDocs() {
      const currentPage = this.pagination.currentPage - 1
      this.loading = true
      const res = await docApi
        .getDocs({
          count: this.pagination.pageSize,
          page: currentPage,
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
    async handleCurrentChange(val) {
      this.pagination.currentPage = val
      this.loading = true
      await this.getDocs()
      this.loading = false
    },
    handleDelete(val) {
      let res
      this.$confirm('此操作将永久删除该文档项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.loading = true
          res = await docApi.deleteDoc(val.row.id)
        } catch (e) {
          this.loading = false
        }
        if (res.code === 0) {
          this.loading = false
          await this.getDocs()

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
      await this.getDocs()
    },
    async editClose() {
      this.showEdit = false
      await this.getDocs()
    }
  },
  async created() {
    this.tableColumn = [
      { prop: 'name', label: '文档名' },
      { prop: 'display_name', label: '显示名' },
    ]
    this.operate = [
      { name: '编辑', func: 'handleEdit', type: 'primary', permission: '编辑文档' },
      { name: '删除', func: 'handleDelete', type: 'danger', permission: '删除文档' }
    ]

    await this.getDocs()
  },
  beforeDestroy() { },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/list.scss';
</style>
