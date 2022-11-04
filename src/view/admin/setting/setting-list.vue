<template>
  <div>
    <div class="container" v-if="!showEdit">
      <div class="header">
        <div class="header-left">
          <div class="title">设置管理</div>
        </div>
        <div class="header-right">
          <div style="margin-left:30px">
            <el-button type="primary" icon="Edit" v-permission="'新增设置'" @click="() => {
              this.showEdit = true;
              this.id = 0;
            }">新增设置</el-button>
            <el-button type="default" icon="Search" @click="refresh">刷新</el-button>
          </div>
        </div>
      </div>
      <!-- 表格 -->
      <lin-table :tableColumn="tableColumn" :tableData="tableData" :operate="operate" :operateWidth="230"
        @handleEdit="handleEdit" @handleDelete="handleDelete" v-loading="loading" :pagination="pagination"
        @currentChange="handleCurrentChange">
        <template v-slot:status="scope">
          <el-setting size="small" v-if="scope.row.status == true" type="success">启用</el-setting>
          <el-setting size="small" v-else type="danger">禁用</el-setting>
        </template>
        <template v-slot:thumbnail_display="scope">
          <div class="thumb" :style="'background-image: url(' + scope.row.thumbnail_display + ');'"></div>
        </template>
      </lin-table>
      <!--表格结束-->
    </div>
    <setting-form v-else :id="id" ref="settingForm" @editClose="editClose"></setting-form>
  </div>
</template>

<script>
import settingApi from '@/lin/model/setting'
import LinTable from '@/component/base/table/lin-table'
import SettingForm from './setting-form'

export default {
  name: 'SettingList',
  components: { LinTable, SettingForm },
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
      this.pagination.pageTotal = res.total
    },
    async handleEdit(val) {
      this.showEdit = true
      this.id = val.row.id
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
        try {
          this.loading = true
          res = await settingApi.deleteSetting(val.row.id)
        } catch (e) {
          this.loading = false
        }
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
  beforeDestroy() { },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/list.scss';
</style>
