<template>
  <el-card shadow="never">
    <el-form ref="form" :model="query" :inline="true">
      <el-form-item label="分组编码" prop="username">
        <el-input
          size="medium"
          style="margin-right: 10px"
          v-model="query.name"
          placeholder="分组编码"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="分组名称">
        <el-input
          size="medium"
          style="margin-right: 10px"
          v-model="query.info"
          placeholder="分组名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="default" icon="Search" @click="getGroups">查询</el-button>
      </el-form-item>
    </el-form>
    <lin-table
      :tableColumn="tableColumn"
      :tableData="tableData"
      :operate="operate"
      :pagination="pagination"
      @currentChange="handleCurrentChange"
      @sizeChange="handleSizeChange"
      @handleEdit="handleEdit"
      @goToGroupEditPage="goToGroupEditPage"
      @handleDelete="handleDelete"
      v-loading="loading"
    >
      <template v-slot:is_static="scope">
        <el-switch v-model="scope.row.is_static" disabled active-text inactive-text></el-switch>
      </template>
    </lin-table>
    <el-dialog
      title="分组信息"
      :append-to-body="true"
      v-model="dialogFormVisible"
      :before-close="handleClose"
      close-on-click-modal
      class="groupListInfoDialog"
    >
      <el-form
        status-icon
        v-if="dialogFormVisible"
        ref="form"
        label-width="120px"
        :model="form"
        label-position="labelPosition"
        :rules="rules"
        style="margin-left: -35px; margin-bottom: -35px; margin-top: 15px"
      >
        <el-form-item label="分组名称" prop="name">
          <el-input size="medium" clearable v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="分组描述" prop="info">
          <el-input size="medium" clearable v-model="form.info"></el-input>
        </el-form-item>
        <el-form-item label="排序码" prop="sort_code">
          <el-input size="medium" type="number" clearable v-model="form.sort_code"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="default" @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="confirmEdit">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </el-card>
</template>

<script>
import Admin from '@/lin/model/admin'
import LinTable from '@/component/base/table/lin-table'

export default {
  components: {
    LinTable,
  },
  data() {
    return {
      id: 0,
      tableData: [],
      tableColumn: [],
      operate: [],
      dialogFormVisible: false,
      labelPosition: 'right',
      query: {
        name: '',
        info: '',
      },
      pagination: {
        pageSize: 10,
        pageTotal: 0,
        currentPage: 1,
      },
      form: {
        name: '',
        info: '',
        sort_code: 0,
      },
      loading: false,
      activeTab: '修改信息',
      rules: {
        name: [{ required: true, message: '请输入分组名称', trigger: 'blur' }],
        info: [],
      },
    }
  },
  methods: {
    async getGroups() {
      this.loading = true
      var res = await Admin.getGroups({
        count: this.pagination.pageSize,
        page: this.pagination.currentPage - 1,
        ...this.query,
      }).finally(() => {
        this.loading = false
      })
      this.tableData = res.items
      this.pagination.pageTotal = res.count
    },
    async confirmEdit() {
      if (this.form.name === '') {
        this.$message.warning('请将信息填写完整')
        return
      }
      const res = await Admin.updateOneGroup(this.form, this.id)
      if (res.code < window.MAX_SUCCESS_CODE) {
        this.$message.success(`${res.message}`)
        this.getGroups()
      }
      this.dialogFormVisible = false
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleEdit(val) {
      this.id = val.row.id
      this.form = { ...val.row }
      this.dialogFormVisible = true
    },
    goToGroupEditPage(val) {
      let selectedData
      if (val.index >= 0) {
        selectedData = val.row
      } else {
        selectedData = val
      }
      this.id = selectedData.id
      this.$router.push({ path: '/admin/group/edit', query: { id: selectedData.id } })
    },
    handleDelete(val) {
      let res
      this.$confirm('此操作将永久删除该分组, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        this.loading = true
        res = await Admin.deleteOneGroup(val.row.id).finally(() => {
          this.loading = false
        })
        if (res.code < window.MAX_SUCCESS_CODE) {
          await this.getGroups()
          this.$message({
            type: 'success',
            message: `${res.message}`,
          })
        }
      })
    },
    handleClose() {
      this.dialogFormVisible = false
    },
    handleClick(tab) {
      this.activeTab = tab.name
    },
    async addGroup(flag) {
      if (flag === true) {
        await this.getGroups()
      }
    },
  },
  async created() {
    await this.getGroups()
    this.tableColumn = [
      { prop: 'name', label: '分组编码' },
      { prop: 'info', label: '分组名称' },
      { prop: 'sort_code', label: '排序码' },
      { prop: 'is_static', label: '静态分组', scopedSlots: { customRender: 'is_static' } },
    ]
    this.operate = [
      { name: '编辑', func: 'handleEdit', type: 'primary' },
      { name: '权限', func: 'goToGroupEditPage', type: 'info' },
      { name: '删除', func: 'handleDelete', type: 'danger' },
    ]
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;

  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
  }
}
</style>
