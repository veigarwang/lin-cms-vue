<template>
  <div>
    <div class="container">
      <div class="header">
        <div class="header-left">
          <div class="title">字典列表</div>
        </div>
        <div class="header-right">
          <div style="margin-left:30px">
            <el-select size="medium" filterable v-model="typeCode" :disabled="types.length === 0" placeholder="请选择分组"
              @change="handleChange" style="margin-right:30px">
              <el-option v-for="(item, index) in types" :key="index" :label="item.full_name" :value="item.type_code">
              </el-option>
            </el-select>
            <el-button type="primary" icon="Edit" v-permission="'新增字典'"
              @click="() => { this.$refs['dialogForm'].show(); }">新增字典
            </el-button>
            <el-button type="default" icon="Search" @click="refresh">
              刷新
            </el-button>
          </div>
        </div>
      </div>
      <!-- 表格 -->
      <lin-table :tableColumn="tableColumn" :tableData="tableData" :operate="operate" @handleEdit="handleEdit"
        @handleDelete="handleDelete" v-loading="loading">
        <template v-slot:status="scope">
          <el-switch v-model="scope.row.status" disabled active-color="#13ce66"></el-switch>
        </template>
        <template v-slot:create_time="scope">
          <span>{{ $filters.filterTimeYmdHms(scope.row.create_time) }}</span>
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
  data() {
    return {
      refreshPagination: true, // 页数增加的时候，因为缓存的缘故，需要刷新Pagination组件
      editIndex: null, // 编辑的行
      tableData: [], // 表格数据
      tableColumn: [], // 表头数据
      operate: [], // 表格按键操作区
      loading: false,
      types: [],
      typeCode: '',
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
        setTimeout(() => {
          this.loading = false
        }, 500)
        this.tableData = res
      } catch (e) {
        this.loading = false
      }
    },
    async handleEdit(val) {
      this.$refs['dialogForm'].show(val.row)
    },
    handleDelete(val) {
      let res
      this.$confirm('此操作将永久删除该字典项, 是否继续?', '提示', {
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
    async refresh() {
      this.types = await baseApi.getTypes()
      await this.getBaseItems()
    },
    // 下拉框选择分组
    async handleChange() {
      this.currentPage = 1
      this.loading = true
      await this.getBaseItems()
      this.loading = false
    },
  },
  async created() {
    this.tableColumn = [
      { prop: 'item_code', label: '编码' },
      { prop: 'item_name', label: '名称' },
      {
        prop: 'status',
        label: '状态',
        scopedSlots: { customRender: 'status' },
      },
      { prop: 'sort_code', label: '排序码' },
      {
        prop: 'create_time',
        label: '创建时间',
        scope: 'create_time',
        scopedSlots: { customRender: 'create_time' },
      },
    ]
    this.operate = [
      { name: '编辑', func: 'handleEdit', type: 'primary', permission: '编辑字典' },
      { name: '删除', func: 'handleDelete', type: 'danger', permission: '删除字典' },
    ]

    this.types = await baseApi.getTypes()
    if (this.types && this.types.length > 0) {
      this.typeCode = this.types[0].type_code
    }
    await this.getBaseItems()
  },
  beforeDestroy() { },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/list.scss';
</style>
