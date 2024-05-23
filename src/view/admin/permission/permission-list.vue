<template>
  <el-card shadow="never" v-if="!showEdit">
    <el-form ref="form" :model="query" :inline="true">
      <el-form-item>
        <el-button @click="getTreePermissionsList" icon="Search"> 查询 </el-button>
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
      <el-table-column prop="name" label="权限名" width="180" />
      <el-table-column prop="router" label="接口地址" width="400" />
      <el-table-column prop="create_time" label="创建时间" width="180">
        <template #default="scope">
          <span>{{ $filters.filterTimeYmdHms(scope.row.create_time) }}</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import Admin from '@/lin/model/admin'
export default {
  name: 'PermissionList',
  components: {},
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
