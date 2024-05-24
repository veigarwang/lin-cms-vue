<template>
  <el-dialog
    title="分组信息"
    :append-to-body="true"
    v-model="dialogFormVisible"
    :before-close="handleClose"
    close-on-click-modal
    :width="520"
    :loading="loading"
  >
    <el-form
      status-icon
      ref="form"
      label-width="120px"
      :model="form"
      label-position="labelPosition"
      :rules="rules"
      style="margin-left: -35px; margin-bottom: -35px; margin-top: 15px"
    >
      <el-form-item label="设置名" prop="name">
        <el-input size="medium" clearable v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="设置值" prop="value">
        <el-input size="medium" clearable v-model="form.value"></el-input>
      </el-form-item>
      <el-form-item label="提供者" prop="provider_name">
        <el-input size="medium" clearable v-model="form.provider_name"></el-input>
      </el-form-item>
      <el-form-item label="提供者键" prop="provider_key">
        <el-input size="medium" clearable v-model="form.provider_key"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="default" @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirmEdit" :loading="confirmLoading">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import settingApi from '@/lin/model/setting'
export default {
  data() {
    return {
      dialogFormVisible: false,
      labelPosition: 'right',
      loading: false,
      confirmLoading: false,
      id: 0,
      form: {
        provider_key: '',
        provider_name: '',
        value: '',
        name: '',
      },
      rules: {
        name: [{ required: true, message: '请输入设置名', trigger: 'blur' }],
        value: [{ required: true, message: '请输入设置值', trigger: 'blur' }],
      },
    }
  },
  computed: {
    title() {
      return this.id == 0 ? '新增' : '编辑'
    },
  },
  methods: {
    async submitForm() {
      if (this.id === 0) {
        return await settingApi.addSetting(this.form)
      } else {
        return await settingApi.editSetting(this.id, this.form)
      }
    },
    async confirmEdit() {
      this.$refs.form.validate(async valid => {
        if (!valid) {
          return
        }
        this.confirmLoading = true
        var res = await this.submitForm().finally(() => {
          this.confirmLoading = false
        })
        this.$message.success(`保存成功`)
        this.$emit('on-save', res.group)
        this.dialogFormVisible = false
      })
    },
    async handleEdit(id) {
      this.dialogFormVisible = true
      this.id = id
      if (id == 0) {
        this.$refs.form.resetFields()
        return
      }
      this.loading = true
      this.form = await settingApi.getSetting(this.id).finally(() => {
        this.loading = false
      })
    },
    handleClose() {
      this.$refs.form.resetFields()
      this.dialogFormVisible = false
    },
  },
}
</script>
