<template>
  <el-dialog title="本地化资源" :append-to-body="true" :before-close="handleClose" v-model="dialogFormVisible">
    <div style="margin-top:-25px;">
      <el-form status-icon v-if="dialogFormVisible" ref="form" label-width="120px" :model="form"
        label-position="labelPosition" :rules="rules" style="margin-left:-35px;margin-bottom:-35px;margin-top:15px;">
        <el-form-item label="编码" prop="key">
          <el-input size="medium" clearable v-model="form.key"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="value">
          <el-input size="medium" clearable v-model="form.value"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer" style="padding-left:5px;">
        <el-button type="primary" @click="confirmEdit('form')">确 定</el-button>
        <el-button @click="resetForm('form')">重 置</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import resourceApi from '../../model/resource'
export default {
  name: 'ResourceDialog',
  components: {},
  data() {
    return {
      id: 0,
      dialogFormVisible: false,
      loading: false,
      form: {
        id: 0,
        key: '',
        value: '',
        culture_id: 0,
      },
      rules: {
        key: [{ required: true, message: '请输入编码', trigger: 'blur' }],
        value: [{ required: true, message: '请输入名称', trigger: 'blur' }],
      },
      types: [],
    }
  },
  methods: {
    show(record) {
      if (record.id) {
        Object.assign(this.form, record)
      } else {
        Object.assign(this.form, {
          id: 0,
          key: '',
          value: '',
          culture_id: record.culture_id,
        })
      }
      this.dialogFormVisible = true
    },
    handleClose(done) {
      this.dialogFormVisible = false
      done()
    },
    async submitForm() {
      if (this.form.id === 0) {
        return await resourceApi.addResource(this.form)
      } else {
        return await resourceApi.editResource(this.form)
      }
    },
    async confirmEdit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.loading = true
          const res = await this.submitForm().finally(() => {
            this.loading = false
          })
          this.$message.success(`操作成功`)
          this.dialogFormVisible = false
          this.$emit('ok')
        } else {
          this.$message.error('请填写正确的信息')
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
  },
  async created() { },
}
</script>

<style lang="scss" scoped>

</style>
