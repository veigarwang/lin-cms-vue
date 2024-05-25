<template>
  <div class="container">
    <el-form
      :model="form"
      status-icon
      :rules="rules"
      label-position="right"
      ref="form"
      v-loading="loading"
      label-width="100px"
    >
      <el-form-item label="密码" prop="new_password">
        <el-input size="medium" clearable type="password" v-model="form.new_password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirm_password" label-position="top">
        <el-input size="medium" clearable type="password" v-model="form.confirm_password" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Admin from '@/lin/model/admin'
export default {
  props: {
    id: {
      type: Number,
      default: 0,
    },
  },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码长度不能少于6位数'))
      } else {
        if (this.form.confirm_password !== '') {
          this.$refs.form.validateField('confirm_password')
        }
        callback()
      }
    }
    const validatePassword2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.new_password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      form: {
        new_password: '',
        confirm_password: '',
      },
      rules: {
        new_password: [{ validator: validatePassword, trigger: 'blur', required: true }],
        confirm_password: [{ validator: validatePassword2, trigger: 'blur', required: true }],
      },
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.loading = true
          this.$emit('on-loading', true)
          let res = await Admin.changePassword(this.form.new_password, this.form.confirm_password, this.id).finally(
            () => {
              this.$emit('on-loading', false)
              this.loading = false
            },
          )
          this.$message.success(`${res.message}`)
          if (res.code < window.MAX_SUCCESS_CODE) {
            this.resetForm(formName)
            this.$emit('handlePasswordResult', true)
          }
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
  },
}
</script>
