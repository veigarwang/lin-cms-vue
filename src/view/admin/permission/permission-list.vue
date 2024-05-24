<template>
  <el-card shadow="never" v-if="!showEdit">
    <el-form ref="form" :model="query" :inline="true">
      <el-form-item>
        <el-button type="default" icon="Search" @click="getPermissionNodes">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table
      ref="multipleTable"
      v-loading="loading"
      row-key="id"
      size="medium"
      highlight-current-row
      :border="true"
      :data="tableData"
      :default-expand-all="false"
      style="width: 100%"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column type="index" width="70" label="#" />
      <el-table-column prop="name" label="权限名" width="280" />
      <el-table-column prop="router" label="接口地址" width="400" />
      <el-table-column prop="sort_code" label="排序码" width="100" />
      <el-table-column prop="create_time" label="创建时间" width="180">
        <template #default="scope">
          <span>{{ $filters.filterTimeYmdHms(scope.row.create_time) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="操作" width="200">
        <template #default="scope">
          <el-button size="small" type="primary" plain @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" plain @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <permission-edit-dialog ref="permissionEditDialog" @on-save="getPermissionNodes"></permission-edit-dialog>
  </el-card>
</template>

<script>
import Admin from '@/lin/model/admin'
import PermissionEditDialog from './permission-edit-dialog.vue'
export default {
  name: 'PermissionList',
  components: {
    PermissionEditDialog,
  },
  data() {
    return {
      loading: false,
      tableData: [],
    }
  },
  async created() {
    await this.getPermissionNodes()
  },
  methods: {
    handleEdit(row) {
      this.$refs.permissionEditDialog.handleEdit(row)
    },
    async deletePermissionNode(id) {
      await Admin.deletePermissionNode(id)
      this.getPermissionNodes()
      this.$message({
        type: 'success',
        message: '删除成功',
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该权限节点, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.deletePermissionNode(row.id)
      })
    },
    async getPermissionNodes() {
      this.loading = true
      const res = await Admin.GetPermissionNodes().finally(() => {
        this.loading = false
      })
      this.tableData = res
      this.total = res.count
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/list.scss';
</style>
