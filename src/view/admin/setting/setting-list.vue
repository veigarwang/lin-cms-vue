<template>
  <div>
    <el-card shadow="never">
      <el-form ref="form" :model="query" :inline="true">
        <el-form-item>
          <el-button
            type="primary"
            icon="Edit"
            v-permission="'新增设置'"
            @click="
              () => {
                this.$refs.settingFormDialog.handleEdit(0)
              }
            "
            >新增设置</el-button
          >
          <el-button type="default" icon="Search" @click="refresh">查询</el-button>
        </el-form-item>
      </el-form>

      <lin-table
        :tableColumn="tableColumn"
        :tableData="tableData"
        :operate="operate"
        :operateWidth="230"
        @handleEdit="handleEdit"
        @handleDelete="handleDelete"
        v-loading="loading"
        :pagination="pagination"
        @currentChange="handleCurrentChange"
      >
        <template v-slot:status="scope">
          <el-setting size="small" v-if="scope.row.status == true" type="success">启用</el-setting>
          <el-setting size="small" v-else type="danger">禁用</el-setting>
        </template>
        <template v-slot:thumbnail_display="scope">
          <div class="thumb" :style="'background-image: url(' + scope.row.thumbnail_display + ');'"></div>
        </template>
      </lin-table>
    </el-card>
    <setting-form-dialog ref="settingFormDialog" @on-save="refresh"></setting-form-dialog>
  </div>
</template>

<script>
import settingApi from '@/lin/model/setting'
import LinTable from '@/component/base/table/lin-table'
import SettingFormDialog from './setting-form-dialog.vue'
export default {
  name: 'SettingList',
  components: { LinTable, SettingFormDialog },
  data() {
    return {
      tableData: [],
      tableColumn: [],
      operate: [],
      loading: false,
      pagination: {
        pageSize: 10,
        pageTotal: 0,
        currentPage: 1,
      },
    }
  },
  methods: {
    async getSettings() {
      const currentPage = this.pagination.currentPage - 1
      this.loading = true
      const res = await settingApi
        .getSettings({
          count: this.pagination.pageSize,
          page: currentPage,
        })
        .finally(r => {
          this.loading = false
        })
      this.tableData = [...res.items]
      this.pagination.pageTotal = res.count
    },
    async handleEdit(val) {
      this.$refs.settingFormDialog.handleEdit(val.row.id)
    },
    async handleCurrentChange(val) {
      this.pagination.currentPage = val
      this.loading = true
      await this.getSettings()
      this.loading = false
    },
    handleDelete(val) {
      let res
      this.$confirm('此操作将永久删除该设置项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        this.loading = true
        res = await settingApi.deleteSetting(val.row.id).finally(() => {
          this.loading = false
        })
        await this.getSettings()

        this.$message({
          type: 'success',
          message: `删除成功`,
        })
      })
    },
    async refresh() {
      await this.getSettings()
    },
    async editClose() {
      this.showEdit = false
      await this.getSettings()
    },
  },
  async created() {
    this.tableColumn = [
      { prop: 'name', label: '键' },
      { prop: 'value', label: '值' },
      { prop: 'provider_name', label: '提供者键' },
      { prop: 'provider_key', label: '提供者值' },
    ]
    this.operate = [
      { name: '编辑', func: 'handleEdit', type: 'primary', permission: '新增修改设置' },
      { name: '删除', func: 'handleDelete', type: 'danger', permission: '删除设置' },
    ]

    await this.getSettings()
  },
  beforeDestroy() {},
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/list.scss';
</style>
