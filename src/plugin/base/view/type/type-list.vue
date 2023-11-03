<template>
  <div>
    <div class="container">
      <div class="header">
        <div class="header-left">
          <div class="title">字典列表</div>
        </div>
        <div class="header-right">
          <div style="margin-left:30px">
            <el-button type="primary" icon="Edit" v-permission="'新增字典类别'" @click="() => {
              this.$refs['dialogForm'].show(0);
            }">新增类别</el-button>
            <el-button type="default" icon="Search" @click="refresh">刷新</el-button>
          </div>
        </div>
      </div>
      <!-- 表格开始 -->
      <lin-table :tableColumn="tableColumn" :tableData="tableData" :operate="operate" @handleEdit="handleEdit"
        @handleDelete="handleDelete" v-loading="loading">
        <template v-slot:create_time="scope">
          <span>{{ $filters.filterTimeYmdHms(scope.row.create_time) }}</span>
        </template>
      </lin-table>
    </div>
    <!--表格结束-->

    <type-dialog ref="dialogForm" @ok="refresh"></type-dialog>
  </div>
</template>

<script>
import LinTable from '@/component/base/table/lin-table'
import baseApi from '../../model/base'
import TypeDialog from './type-dialog'

export default {
  components: { LinTable, TypeDialog },
  inject: ['eventBus'],
  data() {
    return {
      id: 0, // id
      refreshPagination: true, // 页数增加的时候，因为缓存的缘故，需要刷新Pagination组件
      editIndex: null, // 编辑的行
      tableData: [], // 表格数据
      tableColumn: [], // 表头数据
      operate: [], // 表格按键操作区
      loading: false,
    }
  },
  methods: {
    // 根据分组 刷新/获取分组内的用户
    async getBaseTypes() {
      let res
      try {
        this.loading = true

        res = await baseApi.getTypes({})
        setTimeout(() => {
          this.loading = false
          this.tableData = res
        }, 500)
      } catch (e) {
        this.loading = false
      }
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
  beforeDestroy() { },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/list.scss';
</style>
