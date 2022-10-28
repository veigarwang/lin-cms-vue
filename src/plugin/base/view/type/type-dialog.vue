<template>
  <el-dialog title="字典分类信息" :append-to-body="true" :before-close="handleClose" v-model="dialogFormVisible"
    :close-on-click-modal="false">
    <div style="margin-top:-25px;">
      <el-form status-icon v-if="dialogFormVisible" ref="form" label-width="120px" :model="form"
        label-position="labelPosition" :rules="rules" style="margin-left:-35px;margin-bottom:-35px;margin-top:15px;">
        <el-form-item label="类别编码" prop="type_code">
          <el-input size="medium" clearable v-model="form.type_code"></el-input>
        </el-form-item>
        <el-form-item label="类别名称" prop="full_name">
          <el-input size="medium" clearable v-model="form.full_name"></el-input>
        </el-form-item>
        <el-form-item label="排序码" prop="sort_code">
          <el-input size="medium" type="number" clearable v-model="form.sort_code"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer" style="padding-left:5px;">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="confirmEdit('form')">确 定</el-button>
      </div>
    </template>

  </el-dialog>
</template>
<script lang="js">
import baseApi from '../../model/base'

export default {
  name: 'TypeDialog',
  data() {
    return {
      id: 0, // id
      dialogFormVisible: false, // 控制弹窗显示
      loading: false,
      form: {
        // 表单信息
        type_code: '',
        full_name: '',
        sort_code: 0,
      },
      rules: {
        // 表单验证规则
        type_code: [{ required: true, message: '请输入类别编码', trigger: 'blur' }],
        full_name: [{ required: true, message: '请输入类别名称', trigger: 'blur' }],
      },
    }
  },
  methods: {
    show(record) {
      if (record) {
        Object.assign(this.form, record)
        this.id = record.id
      } else {
        this.id = 0
        Object.assign(this.form, {
          type_code: '',
          full_name: '',
          sort_code: 0,
        })
      }
      this.dialogFormVisible = true
    },
    // 弹框 右上角 X
    handleClose() {
      this.dialogFormVisible = false
    },
    async submitForm() {
      if (this.id === 0) {
        return await baseApi.addType(this.form)
      }
      return await baseApi.editType(this.id, this.form)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    async confirmEdit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.loading = true

          const res = await this.submitForm().finally(() => {
            this.loading = false
          })
          this.dialogFormVisible = false
          this.$message.success(`${res.message}`)
          this.resetForm(formName)
          this.$emit('ok')
        } else {
          this.$message.error('请填写正确的信息')
        }
      })
    },
  }
}
</script>
<style scoped>

</style>
