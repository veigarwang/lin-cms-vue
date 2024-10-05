<template>
  <div>
    <div class="container">
      <div class="header">
        <div class="header-left">
          <div class="title">字典条目列表 - {{typeName}}</div>
        </div>
        <div class="header-right">
          <div style="margin-left: 30px">
            <el-button
              type="primary"
              icon="el-icon-edit"
              v-permission="'新增条目'"
              @click="
                () => {
                  this.$refs['dialogForm'].showSubItem(baseTypeId, this.tableData.length)
                }
              "
              >新增条目</el-button
            >
            <el-button type="default" icon="el-icon-refresh" @click="refresh">刷新</el-button>
            <el-button type="default" icon="el-icon-back" @click="back">返回</el-button>
          </div>
        </div>
      </div>
      <!-- 表格 -->
      <lin-table
        :tableColumn="tableColumn"
        :tableData="tableData"
        :operate="operate"
        @handleEdit="handleEdit"
        @handleDelete="handleDelete"
        v-loading="loading"
      >
        <template v-slot:status="scope">
          <el-switch v-model="scope.row.status" disabled active-color="#13ce66"></el-switch>
        </template>
        <template v-slot:create_time="scope">
          <span>{{ scope.row.create_time | filterTimeYmdHms }}</span>
        </template>
      </lin-table>
    </div>
    <!--表格结束-->

    <item-dialog ref="dialogForm" @ok="refresh"></item-dialog>
  </div>
</template>

<script>
import baseApi from '../../model/base'
import LinTable from '@/component/base/table/lin-table'
import ItemDialog from './item-dialog'
export default {
  components: { LinTable, ItemDialog },
  inject: ['eventBus'],
  props: {
    typeCode: {
      type: String,
      default: null,
    },
    typeName: {
      type: String,
      default: null,
    },
    baseTypeId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      refreshPagination: true, // 页数增加的时候，因为缓存的缘故，需要刷新Pagination组件
      editIndex: null, // 编辑的行
      tableData: [], // 表格数据
      tableColumn: [], // 表头数据
      operate: [], // 表格按键操作区
      loading: false,
      types: [],
    }
  },
  methods: {
    // 根据分组 刷新/获取分组内的用户
    async getBaseItems() {
      let res
      try {
        this.loading = true
        res = await baseApi.getItems({
          typeCode: this.typeCode,
        })
        // setTimeout(() => {
        this.tableData = res
        this.loading = false
        // }, 500)
      } catch (e) {
        this.loading = false
      }
    },
    async handleEdit(val) {
      this.$refs['dialogForm'].show(val.row)
    },
    handleDelete(val) {
      let res
      this.$confirm('此操作将永久删除该字典条目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.loading = true
          res = await baseApi.deleteItem(val.row.id)
        } catch (e) {
          this.loading = false
        }
        if (res.code === 0) {
          this.loading = false
          await this.getBaseItems()

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
    async refresh(val) {
      //this.types = await baseApi.getTypes()
      await this.getBaseItems()
      if (val) this.$message.success('刷新成功')
    },
    // 下拉框选择分组
    // async handleChange() {
    //   this.currentPage = 1
    //   this.loading = true
    //   await this.getBaseItems()
    //   this.loading = false
    // },
    back() {
      this.$emit('editClose')
    },
  },
  async created() {
    this.tableColumn = [
      { prop: 'sort_code', label: '序号', align: 'center', width: '150px' },
      { prop: 'item_name', label: '名称' },
      { prop: 'item_details', label: '明细' },
      // {
      //   prop: 'status',
      //   label: '状态',
      //   scopedSlots: { customRender: 'status' },
      // },
      {
        prop: 'create_time',
        label: '创建时间',
        scope: 'create_time',
        scopedSlots: { customRender: 'create_time' },
        align: 'center',
      },
    ]
    this.operate = [
      { name: '编辑', func: 'handleEdit', type: 'primary', permission: '编辑字典' },
      { name: '删除', func: 'handleDelete', type: 'danger', permission: '删除字典' },
    ]

    // this.types = await baseApi.getTypes()
    // if (this.types && this.types.length > 0) {
    //   this.typeCode = this.types[0].type_code
    // }
    await this.getBaseItems()
  },
  beforeDestroy() {},
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/list.scss';
</style>
