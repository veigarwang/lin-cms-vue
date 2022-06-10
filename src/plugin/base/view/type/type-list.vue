<template>
  <div>
    <div class="container" v-if="!showEdit">
      <div class="header">
        <div class="header-left">
          <div class="title">字典类别列表</div>
        </div>
        <div class="header-right">
          <div style="margin-left: 30px">
            <el-button
              type="primary"
              icon="el-icon-edit"
              v-permission="'新增字典类别'"
              @click="
                () => {
                  this.$refs['dialogForm'].show(0)
                }
              "
              >新增类别</el-button
            >
            <el-button type="default" icon="el-icon-refresh" @click="refresh">刷新</el-button>
          </div>
        </div>
      </div>
      <!-- 表格开始 -->
      <lin-table
        :tableColumn="tableColumn"
        :tableData="tableData"
        :operate="operate"
        @handleEdit="handleEdit"
        @handleSubItem="handleSubItem"
        @handleDelete="handleDelete"
        v-loading="loading"
      >
        <template v-slot:create_time="scope">
          <span>{{ scope.row.create_time | filterTimeYmdHms }}</span>
        </template>
      </lin-table>
    </div>
    <!-- 编辑页面 -->
    <type-item v-else @editClose="editClose" :typeCode="typeCode"></type-item>
    <!--表格结束-->

    <type-dialog ref="dialogForm" @ok="refresh"></type-dialog>
  </div>
</template>

<script>
import baseApi from '../../model/base'
import LinTable from '@/component/base/table/lin-table'
import TypeDialog from './type-dialog'
import TypeItem from './type-item'
export default {
  components: { LinTable, TypeDialog, TypeItem },
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
      showEdit: false,
      typeCode: 1,
    }
  },
  methods: {
    // 根据分组 刷新/获取分组内的用户
    async getBaseTypes() {
      let res
      try {
        this.loading = true

        res = await baseApi.getTypes({})
        // setTimeout(() => {
        this.loading = false
        this.tableData = res
        // }, 500)
      } catch (e) {
        this.loading = false
      }
    },
    async handleEdit(val) {
      this.$refs['dialogForm'].show(val.row)
    },
    handleSubItem(val) {
      this.showEdit = true
      this.typeCode = val.row.type_code
    },
    editClose() {
      this.showEdit = false
    },
    handleDelete(val) {
      this.$confirm('此操作将永久删除该字典类型, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        this.loading = true

        let res = await baseApi.deleteType(val.row.id).finally(() => {
          this.loading = false
        })

        await this.getBaseTypes()

        this.$message({
          type: 'success',
          message: `${res.message}`,
        })
      })
    },
    async refresh() {
      await this.getBaseTypes()
      this.$message.success('刷新成功')
    },
  },
  async created() {
    this.tableColumn = [
      { prop: 'sort_code', label: '序号', align: 'center', width: '150px' },
      { prop: 'type_code', label: '编码' },
      { prop: 'full_name', label: '名称' },
      {
        prop: 'create_time',
        label: '创建时间',
        scope: 'create_time',
        scopedSlots: { customRender: 'create_time' },
        align: 'center',
      },
    ]
    this.operate = [
      {
        name: '编辑',
        func: 'handleEdit',
        type: 'primary',
        permission: '编辑字典类别',
      },
      { name: '查看', func: 'handleSubItem', type: 'success' },
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
