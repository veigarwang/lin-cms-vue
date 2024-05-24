<template>
  <el-dialog
    title="分组信息"
    :append-to-body="true"
    v-model="dialogFormVisible"
    :before-close="handleClose"
    close-on-click-modal
    class="groupListInfoDialog"
    :width="520"
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
</template>

<script>
import Admin from '@/lin/model/admin'
export default {
  data() {
    return {
      dialogFormVisible: false,
      labelPosition: 'right',
      form: {
        name: '',
        info: '',
        sort_code: 0,
      },
      rules: {
        name: [{ required: true, message: '请输入分组名称', trigger: 'blur' }],
        info: [],
      },
    }
  },
  methods: {
    async confirmEdit() {
      this.$refs.form.validate(async valid => {
        if (!valid) {
          return
        }
        const res = await Admin.updateOneGroup(this.form, this.id)
        this.$message.success(`${res.message}`)
        this.$emit('on-save', res.group)
        this.dialogFormVisible = false
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleEdit(val) {
      this.id = val.row.id
      this.form = { ...val.row }
      this.dialogFormVisible = true
    },
    handleClose() {
      this.resetForm('form')
      this.dialogFormVisible = false
    },
  },
}
</script>
