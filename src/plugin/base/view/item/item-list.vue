<template>
  <div style="padding: 8px">
    <el-card shadow="never">
      <el-form ref="form" :model="query" :inline="true">
        <el-form-item label="类别" prop="typeCode">
          <el-select
            style="width: 200px"
            size="medium"
            filterable
            v-model="query.typeCode"
            :disabled="types.length === 0"
            placeholder="请选择分组"
            @change="handleChange"
          >
            <el-option v-for="(item, index) in types" :key="index" :label="item.full_name" :value="item.type_code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="default" icon="Search" @click="refresh"> 刷新 </el-button>
          <el-button
            type="primary"
            icon="Edit"
            v-permission="'新增字典'"
            @click="
              () => {
                this.$refs['dialogForm'].show()
              }
            "
            >新增字典
          </el-button>
        </el-form-item>
      </el-form>
      <lin-table
        :tableColumn="tableColumn"
        :tableData="tableData"
        :border="false"
        :operate="operate"
        @handleEdit="handleEdit"
        @handleDelete="handleDelete"
        v-loading="loading"
      >
        <template v-slot:status="scope">
          <el-switch v-model="scope.row.status" disabled active-color="#13ce66"></el-switch>
        </template>
        <template v-slot:create_time="scope">
          <span>{{ $filters.filterTimeYmdHms(scope.row.create_time) }}</span>
        </template>
      </lin-table>
      <item-dialog ref="dialogForm" @ok="refresh"></item-dialog>
    </el-card>
  </div>
</template>

<script>
import baseApi from '../../model/base'
import LinTable from '@/component/base/table/lin-table'
import ItemDialog from './item-dialog'
export default {
  components: { LinTable, ItemDialog },
  data() {
    return {
      refreshPagination: true,
      editIndex: null,
      tableData: [],
      tableColumn: [],
      operate: [],
      loading: false,
      types: [],
      query: {
        typeCode: '',
      },
    }
  },
  methods: {
    async getBaseItems() {
      let res
      this.loading = true
      res = await baseApi
        .getItems({
          typeCode: this.query.typeCode,
        })
        .finally(() => {
          this.loading = false
        })
      this.tableData = res
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
        this.loading = true
        res = await baseApi.deleteItem(val.row.id).finally(() => {
          this.loading = false
        })

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
    async handleChange() {
      this.currentPage = 1
      this.loading = true
      await this.getBaseItems().finally(() => {
        this.loading = false
      })
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
      this.query.typeCode = this.types[0].type_code
    }
    await this.getBaseItems()
  },
  beforeDestroy() {},
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/list.scss';
</style>
