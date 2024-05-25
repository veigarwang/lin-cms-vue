<template>
  <div class="container">
    <el-form
      :model="form"
      status-icon
      :rules="rules"
      label-position="right"
      ref="form"
      label-width="100px"
      @submit.native.prevent
    >
      <el-form-item label="用户名" prop="username">
        <el-input size="medium" clearable v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input size="medium" clearable v-model="form.nickname"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input size="medium" clearable v-model="form.email" auto-complete="new-password"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="active">
        <el-switch
          v-model="form.active"
          active-color="#13ce66"
          :active-value="1"
          :inactive-value="2"
          active-text="启用"
          inactive-text="禁用"
        ></el-switch>
      </el-form-item>
      <el-form-item v-if="pageType === 'add'" label="密码" prop="password">
        <el-input size="medium" clearable type="password" v-model="form.password" auto-complete="new-password">
        </el-input>
      </el-form-item>
      <el-form-item v-if="pageType === 'add'" label="确认密码" prop="confirm_password" label-position="top">
        <el-input size="medium" clearable type="password" v-model="form.confirm_password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="选择分组">
        <el-select v-model="form.group_ids" multiple placeholder="Select" style="width: 100%">
          <el-option v-for="item in groups" :key="item.id" :label="item.info" :value="item.id" />
        </el-select>
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
      default: undefined,
    },
    groups: {
      type: Array,
      default: () => {},
    },
    info: {
      type: Object,
      default: () => {},
    },
    pageType: {
      type: String,
      default: 'add',
    },
  },
  watch: {
    info: {
      handler() {
        this.setInfo()
      },
      deep: true,
    },
  },
  data() {
    const checkUserName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('用户名不能为空'))
      }
      callback()
    }
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码长度不能少于6位数'))
      } else {
        if (this.form.checkPassword !== '') {
          this.$refs.form.validateField('confirm_password')
        }
        callback()
      }
    }
    const validatePassword2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      isEdited: false,
      form: {
        username: '',
        nickname: '',
        password: '',
        confirm_password: '',
        email: '',
        group_ids: [],
        active: 1,
      },
      rules: {
        // username: [
        //   {
        //     validator: checkUserName,
        //     trigger: ['blur', 'change'],
        //     required: true,
        //   },
        // ],
        nickname: [
          {
            trigger: ['blur', 'change'],
            required: true,
            message: '请输入昵称',
          },
        ],
        password: [{ validator: validatePassword, trigger: 'blur', required: true }],
        confirm_password: [{ validator: validatePassword2, trigger: 'blur', required: true }],
        password: [{ validator: validatePassword, trigger: 'blur', required: true }],
        confirm_password: [{ validator: validatePassword2, trigger: 'blur', required: true }],
        email: [
          {
            type: 'email',
            message: '请输入正确的邮箱地址或者不填',
            trigger: ['blur', 'change'],
          },
        ],
      },
    }
  },
  methods: {
    goBack() {
      this.$router.push({ path: '/admin/user/list' })
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.loading = true
          this.$emit('on-loading', true)
          if (this.pageType === 'add') {
            await Admin.createUser(this.form).finally(() => {
              this.loading = false
              this.$emit('on-loading', false)
            })
          } else {
            await Admin.updateUser(this.id, this.form).finally(() => {
              this.loading = false
              this.$emit('on-loading', false)
            })
          }
          this.$emit('handleInfoResult', true)
        }
      })
    },
    resetForm(formName) {
      if (this.pageType === 'edit') {
        this.setInfo()
      } else {
        this.form.group_ids = []
        this.$refs[formName].resetFields()
      }
    },
    setInfo() {
      this.form.username = this.info.username
      this.form.nickname = this.info.nickname
      this.form.email = this.info.email
      this.form.active = this.info.active
      this.form.group_ids = this.info.group_ids
    },
  },
  created() {
    if (this.pageType === 'edit') {
      this.setInfo()
      this.isEdited = true
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  margin-top: 20px;
  margin-left: -5px;
  max-width: 800px;

  .submit {
    float: right;
  }
}
</style>

<style lang="scss">
// .el-radio-group {
//   &.user-info {
//     display: flex;
//     flex-wrap: wrap;
//     > .el-radio {
//       width: 150px;
//       margin-left: 0px !important;
//       margin-right: 10px;
//       margin-bottom: 20px;
//       white-space: normal;
//       display: flex;
//     }
//   }
// }
</style>
