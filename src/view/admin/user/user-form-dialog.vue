<template>
  <el-dialog
    title="用户信息"
    :width="520"
    :append-to-body="true"
    :before-close="handleClose"
    v-model="dialogFormVisible"
    close-on-click-modal
  >
    <el-tabs v-model="activeTab" @tab-click="handleClick">
      <el-tab-pane :label="title" name="修改信息">
        <user-info
          ref="userInfo"
          @handleInfoResult="handleInfoResult"
          @on-loading="onLoading"
          :pageType="pageType"
          :id="form.id"
          :groups="groups"
          :info="form"
          class="info"
        />
      </el-tab-pane>
      <el-tab-pane label="修改密码" name="修改密码" v-if="pageType == 'edit'">
        <user-password
          ref="password"
          @on-loading="onLoading"
          @handlePasswordResult="handlePasswordResult"
          :id="form.id"
          class="password"
        />
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="default" @click="handleClose">取消</el-button>
        <el-button type="primary" @click="confirmEdit" :loading="loading">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import Admin from '@/lin/model/admin'
import UserPassword from './user-password.vue'
import UserInfo from './user-info'
export default {
  components: { UserPassword, UserInfo },
  props: {
    groups: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      loading: false,
      pageType: 'edit',
      selectGroup: '',
      activeTab: '修改信息',
      dialogFormVisible: false,
      form: {
        id: 0,
        username: '',
        nickname: '',
        password: '',
        confirm_password: '',
        email: '',
        group_ids: [],
        active: 1,
      },
    }
  },
  computed: {
    title() {
      return this.pageType === 'add' ? '新增用户' : '修改用户'
    },
  },
  methods: {
    showDialog(id) {
      if (id == 0) {
        this.pageType = 'add'
      } else {
        this.pageType = 'edit'
      }
      this.dialogFormVisible = true
      this.form.id = id
      this.getUser()
    },
    async getUser() {
      var user = await Admin.getUser(this.form.id)
      Object.assign(this.form, user)
      this.form.group_ids = user.groups.map(item => item.id)
    },
    handleClose() {
      this.dialogFormVisible = false
    },
    handleClick(tab) {
      this.activeTab = tab.name
    },
    onLoading(flag) {
      this.loading = flag
    },
    async handleInfoResult(flag) {
      this.dialogFormVisible = false
      if (flag === true) {
        this.$emit('handleEditResult', true)
      }
    },
    handlePasswordResult(result) {
      if (result === true) {
        this.dialogFormVisible = false
      }
    },
    confirmEdit() {
      if (this.activeTab === '修改信息') {
        this.$refs.userInfo.submitForm('form')
      } else {
        this.$refs.password.submitForm('form')
      }
    },
  },
}
</script>

<style>
.password {
  margin-top: 20px;
}
</style>
