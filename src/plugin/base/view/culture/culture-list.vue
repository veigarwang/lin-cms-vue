<template>
  <div>
    <div class="container">
      <div class="header">
        <div class="header-left">
          <div class="title">本地化语言</div>
        </div>
        <div class="header-right">
          <div style="margin-left:30px">
            <el-button type="primary" icon="Edit" v-permission="'新增本地化'" @click="() => {
              this.$router.push(`/base/culture/form`)
            }">新增本地化</el-button>
            <el-button type="default" @click="refresh" icon="Search">
              刷新
            </el-button>
          </div>
        </div>
      </div>
      <!-- 表格 -->
      <lin-table :tableColumn="tableColumn" :tableData="tableData" :operate="operate" @handleEdit="handleEdit"
        @handleDelete="handleDelete" v-loading="loading"></lin-table>
    </div>
    <!--表格结束-->
  </div>
</template>

<script>
import cultureApi from '../../model/culture'
import LinTable from '@/component/base/table/lin-table'
export default {
  components: { LinTable },
  data() {
    return {
      refreshPagination: true,
      editIndex: null,
      tableData: [],
      tableColumn: [],
      operate: [],
      loading: false,
    }
  },
  methods: {
    async getCultures() {
      this.loading = true
      this.tableData = await cultureApi.getCultures().finally(r => {
        this.loading = false
      })
    },
    async handleEdit(val) {
      this.$router.push(`/base/culture/form/${val.row.id}`)
    },
    handleDelete(val) {
      let res
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.loading = true
          res = await cultureApi.deleteCulture(val.row.id)
        } catch (e) {
          this.loading = false
        }
        if (res.code === 0) {
          this.loading = false
          await this.getCultures()

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
      await this.getCultures()
    },
  },
  async created() {
    this.tableColumn = [
      { prop: 'name', label: '编码' },
      { prop: 'display_name', label: '名称' },
    ]
    this.operate = [
      { name: '编辑', func: 'handleEdit', type: 'primary', permission: '更新本地化' },
      { name: '删除', func: 'handleDelete', type: 'danger', permission: '删除本地化' },
    ]

    await this.getCultures()
  },
  beforeDestroy() { },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/list.scss';
</style>
