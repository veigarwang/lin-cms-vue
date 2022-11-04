<template>
  <div>
    <sticky-top>
      <div class="title">
        <span>{{ title[this.id == 0 ? 0 : 1] }}</span>
        <span class="back" @click="goBack">
          <i class="iconfont icon-fanhui"></i> 返回
        </span>
      </div>
    </sticky-top>
    <div class="container">
      <div class="wrap">
        <el-row>
          <el-col :lg="16" :md="20" :sm="24" :xs="24">
            <el-form status-icon ref="form" label-width="120px" :model="form" label-position="labelPosition"
              :rules="rules" style="margin-left:-35px;margin-bottom:-35px;margin-top:15px;">
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
              <el-form-item class="submit">
                <el-button type="primary" @click="confirmEdit('form')">保 存</el-button>
                <el-button @click="resetForm('form')">重 置</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import settingApi from '@/lin/model/setting'
import UploadImgs from '@/component/base/upload-image'
export default {
  name: 'SettingForm',
  components: { UploadImgs },
  props: {
    id: {
      type: [String, Number],
    },
  },
  data() {
    return {
      title: ['新增设置管理', '编辑设置管理'],
      loading: false,
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

  async created() { },
  async mounted() {
    this.show(this.id)
  },
  methods: {
    async show(id) {
      if (id != 0) {
        let setting = await settingApi.getSetting(id)
        this.form = setting
      } else {
        Object.assign(this.form, {
          provider_key: '',
          provider_name: '',
          value: '',
          name: '',
        })
      }
    },
    async submitForm() {
      if (this.id === 0) {
        return await settingApi.addSetting(this.form)
      } else {
        return await settingApi.editSetting(this.id, this.form)
      }
    },
    async confirmEdit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let res
          this.loading = true
          res = await this.submitForm().finally(() => {
            this.loading = false
          })

          this.$message.success(`配置成功`)
          this.$emit('editClose')
        } else {
          this.$message.error('请填写正确的信息')
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    goBack() {
      this.$emit('editClose')
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/form.scss';
</style>
