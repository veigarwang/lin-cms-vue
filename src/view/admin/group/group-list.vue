<template>
  <el-card shadow="never">
    <el-form ref="form" :model="query" :inline="true">
      <el-form-item label="分组编码" prop="username">
        <el-input
          size="medium"
          style="margin-right: 10px"
          v-model="query.name"
          placeholder="分组编码"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="分组名称">
        <el-input
          size="medium"
          style="margin-right: 10px"
          v-model="query.info"
          placeholder="分组名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="default" icon="Search" @click="getGroups">查询</el-button>
      </el-form-item>
    </el-form>
    <lin-table
      :tableColumn="tableColumn"
      :tableData="tableData"
      :operate="operate"
      :pagination="pagination"
      @currentChange="handleCurrentChange"
      @sizeChange="handleSizeChange"
      @handleEdit="handleEdit"
      @goToGroupEditPage="goToGroupEditPage"
      @handleDelete="handleDelete"
      v-loading="loading"
    >
      <template v-slot:is_static="scope">
        <el-switch v-model="scope.row.is_static" disabled active-text inactive-text></el-switch>
      </template>
    </lin-table>
    <group-form-dialog @on-save="getGroups" ref="groupFormDialog"></group-form-dialog>
  </el-card>
</template>

<script>
import Admin from '@/lin/model/admin'
import LinTable from '@/component/base/table/lin-table'
import GroupFormDialog from './group-form-dialog'
export default {
  components: {
    LinTable,
    GroupFormDialog,
  },
  data() {
    return {
      tableData: [],
      tableColumn: [],
      operate: [],
      query: {
        name: '',
        info: '',
      },
      pagination: {
        pageSize: 10,
        pageTotal: 0,
        currentPage: 1,
      },
      loading: false,
    }
  },
  methods: {
    async getGroups() {
      this.loading = true
      var res = await Admin.getGroups({
        count: this.pagination.pageSize,
        page: this.pagination.currentPage - 1,
        ...this.query,
      }).finally(() => {
        this.loading = false
      })
      this.tableData = res.items
      this.pagination.pageTotal = res.count
    },

    goToGroupEditPage(val) {
      let selectedData
      if (val.index >= 0) {
        selectedData = val.row
      } else {
        selectedData = val
      }
      this.$router.push({ path: '/admin/group/edit', query: { id: selectedData.id } })
    },
    handleDelete(val) {
      let res
      this.$confirm('此操作将永久删除该分组, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        this.loading = true
        res = await Admin.deleteGroup(val.row.id).finally(() => {
          this.loading = false
        })
        if (res.code < window.MAX_SUCCESS_CODE) {
          await this.getGroups()
          this.$message({
            type: 'success',
            message: `${res.message}`,
          })
        }
      })
    },
    async addGroup(flag) {
      if (flag === true) {
        await this.getGroups()
      }
    },
    handleEdit(val) {
      this.$refs.groupFormDialog.handleEdit(val)
    },
  },
  async created() {
    await this.getGroups()
    this.tableColumn = [
      { prop: 'name', label: '分组编码' },
      { prop: 'info', label: '分组名称' },
      { prop: 'sort_code', label: '排序码' },
      { prop: 'is_static', label: '静态分组', scopedSlots: { customRender: 'is_static' } },
    ]
    this.operate = [
      { name: '权限', func: 'goToGroupEditPage', type: 'default', permission: '分配权限' },
      { name: '编辑', func: 'handleEdit', type: 'primary', permission: '更新权限组' },
      { name: '删除', func: 'handleDelete', type: 'danger', permission: '删除权限组' },
    ]
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;

  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
  }
}
</style>
