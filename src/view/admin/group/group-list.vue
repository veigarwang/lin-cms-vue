<template>
  <div class="container">
    <div class="title">分组列表信息</div>
    <lin-table :tableColumn="tableColumn" :tableData="tableData" :operate="operate" @handleEdit="handleEdit"
      @goToGroupEditPage="goToGroupEditPage" @handleDelete="handleDelete" @row-click="rowClick" v-loading="loading">
      <template v-slot:is_static="scope">
        <el-switch v-model="scope.row.is_static" disabled active-text inactive-text></el-switch>
      </template>
    </lin-table>
    <el-dialog title="分组信息" :append-to-body="true" v-model="dialogFormVisible" :before-close="handleClose"
      :close-on-click-modal="false" class="groupListInfoDialog">
      <div style="margin-top:-25px;">
        <el-form status-icon v-if="dialogFormVisible" ref="form" label-width="120px" :model="form"
          label-position="labelPosition" :rules="rules" style="margin-left:-35px;margin-bottom:-35px;margin-top:15px;">
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
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="default" @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="confirmEdit">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import Admin from '@/lin/model/admin'
import LinTable from '@/component/base/table/lin-table'

export default {
  components: {
    LinTable,
  },
  inject: ['eventBus'],
  data() {
    return {
      id: 0, // 分组id
      tableData: [], // 表格数据
      tableColumn: [], // 表头数据
      operate: [], // 表格按键操作区
      dialogFormVisible: false, // 是否弹窗
      labelPosition: 'right', // 设置label位置
      form: {
        // 表单信息
        name: '',
        info: '',
        sort_code: 0,
      },
      loading: false,
      activeTab: '修改信息', // tab 标题
      rules: {
        // 表单验证规则
        name: [{ required: true, message: '请输入分组名称', trigger: 'blur' }],
        info: [],
      },
    }
  },
  methods: {
    // 获取所有分组并传给table渲染
    async getAllGroups() {
      try {
        this.loading = true
        this.tableData = await Admin.getAllGroups()
        this.loading = false
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    async confirmEdit() {
      // 修改分组信息
      if (this.form.name === '') {
        this.$message.warning('请将信息填写完整')
        return
      }
      const res = await Admin.updateOneGroup(this.form, this.id)
      if (res.code < window.MAX_SUCCESS_CODE) {
        this.$message.success(`${res.message}`)
        this.getAllGroups()
      }
      this.dialogFormVisible = false
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 获取所拥有的权限并渲染  由子组件提供
    handleEdit(val) {
      let selectedData
      // 单击 编辑按键
      if (val.index >= 0) {
        selectedData = val.row
      } else {
        // 单击 table row
        selectedData = val
      }
      this.id = selectedData.id
      this.form = { ...selectedData }
      this.dialogFormVisible = true
    },
    goToGroupEditPage(val) {
      let selectedData
      // 单击 编辑按键
      if (val.index >= 0) {
        selectedData = val.row
      } else {
        // 单机 table row
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
        try {
          this.loading = true
          res = await Admin.deleteOneGroup(val.row.id)
          if (res.code < window.MAX_SUCCESS_CODE) {
            await this.getAllGroups()
            this.$message({
              type: 'success',
              message: `${res.message}`,
            })
          }
          this.loading = false
        } catch (e) {
          this.loading = false
        }
      })
    },
    // 双击 table row
    rowClick(row) {
      this.handleEdit(row)
    },
    // 弹框 右上角 X
    handleClose() {
      this.dialogFormVisible = false
    },
    // 切换tab栏
    handleClick(tab) {
      this.activeTab = tab.name
    },
    // 监听分添加组是否成功
    async addGroup(flag) {
      if (flag === true) {
        await this.getAllGroups()
      }
    },
  },
  async created() {
    await this.getAllGroups()
    // 设置表头信息
    this.tableColumn = [
      { prop: 'name', label: '名称' },
      { prop: 'info', label: '信息' },
      { prop: 'sort_code', label: '排序码' },
      { prop: 'is_static', label: '静态分组', scopedSlots: { customRender: 'is_static' } },
    ]
    this.operate = [
      { name: '编辑', func: 'handleEdit', type: 'primary' },
      { name: '权限', func: 'goToGroupEditPage', type: 'info' },
      { name: '删除', func: 'handleDelete', type: 'danger' },
    ]
    // 监听添加分组是否成功
    this.eventBus.$on('addGroup', this.addGroup)
  },
  beforeDestroy() {
    this.eventBus.$off('addUser', this.addGroup)
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
