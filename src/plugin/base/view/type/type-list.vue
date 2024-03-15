<template>
  <div style="padding: 8px">
    <el-card shadow="never">
      <el-form ref="form" :inline="true">
        <el-form-item>
          <el-button type="default" icon="Search" @click="refresh">刷新</el-button>
          <el-button
            type="primary"
            icon="Edit"
            v-permission="新增字典类别"
            @click="
              () => {
                this.$refs['dialogForm'].show(0)
              }
            "
            >新增类别</el-button
          >
        </el-form-item>
      </el-form>
      <lin-table
        :tableColumn="tableColumn"
        :tableData="tableData"
        :operate="operate"
        @handleEdit="handleEdit"
        @handleDelete="handleDelete"
        v-loading="loading"
      >
        <template v-slot:create_time="scope">
          <span>{{ $filters.filterTimeYmdHms(scope.row.create_time) }}</span>
        </template>
      </lin-table>
    </el-card>
    <type-dialog ref="dialogForm" @ok="refresh"></type-dialog>
  </div>
</template>

<script>
import LinTable from '@/component/base/table/lin-table'
import baseApi from '../../model/base'
import TypeDialog from './type-dialog'

export default {
  components: { LinTable, TypeDialog },
  data() {
    return {
      id: 0,
      refreshPagination: true,
      editIndex: null,
      tableData: [],
      tableColumn: [],
      operate: [],
      loading: false,
    }
  },
  methods: {
    async getBaseTypes() {
      let res
      this.loading = true
      res = await baseApi.getTypes({}).finally(() => {
        this.loading = false
      })
      this.tableData = res
    },
    async handleEdit(val) {
      this.$refs['dialogForm'].show(val.row)
    },
    handleDelete(val) {
      this.$confirm('此操作将永久删除该字典项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        this.loading = true

        const res = await baseApi.deleteType(val.row.id).finally(() => {
          this.loading = false
        })

        await this.refresh()

        this.$message({
          type: 'success',
          message: `${res.message}`,
        })
      })
    },
    async refresh() {
      await this.getBaseTypes()
    },
  },
  async created() {
    this.tableColumn = [
      { prop: 'type_code', label: '编码' },
      { prop: 'full_name', label: '名称' },
      { prop: 'sort_code', label: '排序码' },
      {
        prop: 'create_time',
        label: '创建时间',
        scope: 'create_time',
        scopedSlots: { customRender: 'create_time' },
      },
    ]
    this.operate = [
      {
        name: '编辑',
        func: 'handleEdit',
        type: 'primary',
        permission: '编辑字典类别',
      },
      {
        name: '删除',
        func: 'handleDelete',
        type: 'danger',
        permission: '删除字典类别',
      },
    ]
    await this.getBaseTypes()
  },
  beforeDestroy() {},
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/list.scss';
</style>
