<template>
  <div style="padding: 8px">
    <el-card shadow="never">
      <el-form ref="form" :model="query" :inline="true">
        <el-form-item label="用户名" prop="username">
          <el-input
            size="medium"
            style="margin-right: 10px"
            v-model="pagination.username"
            placeholder="用户名"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input
            size="medium"
            style="margin-right: 10px"
            v-model="pagination.nickname"
            placeholder="昵称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="邮件" prop="email">
          <el-input
            size="medium"
            style="margin-right: 10px"
            v-model="pagination.email"
            placeholder="邮件"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="分组" prop="typeCode">
          <el-select
            size="medium"
            filterable
            v-model="group_id"
            placeholder="请选择分组"
            @change="handleChange"
            clearable
            style="margin-right: 30px; width: 200px"
          >
            <el-option v-for="(group, index) in groups" :key="index" :label="group.info" :value="group.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="default" icon="Search" @click="getAdminUsers">查询</el-button>
        </el-form-item>
      </el-form>
      <lin-table
        :tableColumn="tableColumn"
        :tableData="tableData"
        :operate="operate"
        @handleEdit="handleEdit"
        @handleDelete="handleDelete"
        v-loading="loading"
        @currentChange="handleCurrentChange"
        @sizeChange="handleSizeChange"
        :pagination="pagination"
      >
        <template v-slot:active="scope">
          <el-switch v-model="scope.row.active" disabled active-color="#13ce66" :active-value="1" :inactive-value="2">
          </el-switch>
        </template>
        <template v-slot:create_time="scope">
          <span>{{ $filters.filterTimeYmdHms(scope.row.create_time) }}</span>
        </template>
        <template v-slot:groups="scope">
          <el-tag
            style="margin-right: 1px"
            size="small"
            v-for="(item, index) in scope.row.groups"
            v-bind:key="index"
            type="primary"
            >{{ item.info }}</el-tag
          >
        </template>
      </lin-table>
      <el-dialog
        title="用户信息"
        :append-to-body="true"
        :before-close="handleClose"
        v-model="dialogFormVisible"
        close-on-click-modal
      >
        <el-tabs v-model="activeTab" @tab-click="handleClick">
          <el-tab-pane label="修改信息" name="修改信息">
            <user-info
              ref="userInfo"
              @handleInfoResult="handleInfoResult"
              labelPosition="right"
              pageType="edit"
              :id="id"
              :groups="groups"
              :info="form"
              :submit="false"
              class="info"
            />
          </el-tab-pane>
          <el-tab-pane label="修改密码" name="修改密码">
            <user-password ref="password" @handlePasswordResult="handlePasswordResult" :id="id" class="password" />
          </el-tab-pane>
        </el-tabs>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="default" @click="handleClose">取消</el-button>
            <el-button type="primary" @click="confirmEdit">确定</el-button>
          </div>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Admin from '@/lin/model/admin'
import LinTable from '@/component/base/table/lin-table'
import UserInfo from './user-info'
import UserPassword from './user-password'
export default {
  components: { LinTable, UserInfo, UserPassword },
  data() {
    window.th = this
    return {
      id: 0,
      editIndex: null,
      tableData: [],
      tableColumn: [],
      operate: [],
      dialogFormVisible: false,
      selectGroup: '',
      groups: [],
      group_id: undefined,
      activeTab: '修改信息',
      pagination: {
        pageSize: 10,
        pageTotal: 0,
        currentPage: 1,
        nickname: '',
        username: '',
        email: '',
      },
      form: {
        username: '',
        nickname: '',
        password: '',
        confirm_password: '',
        email: '',
        group_ids: [],
        active: 1,
      },
      loading: false,
    }
  },
  methods: {
    async getAdminUsers() {
      let res
      const currentPage = this.pagination.currentPage - 1
      this.loading = true
      console.log(this.pagination.nickname)
      res = await Admin.getAdminUsers({
        count: this.pagination.pageSize,
        page: currentPage,
        group_id: this.group_id,
        nickname: this.pagination.nickname,
        username: this.pagination.username,
        email: this.pagination.email,
      }).finally(() => {
        this.loading = false
      })
      this.tableData = res.items
      this.pagination.pageTotal = res.count
    },
    async getAllGroups() {
      this.loading = true
      this.groups = await Admin.getAllGroups().finally(() => {
        this.loading = false
      })
    },
    handleEdit(val) {
      this.editIndex = val.index
      let selectedData

      if (val.index >= 0) {
        selectedData = val.row
      } else {
        selectedData = val
      }
      this.id = selectedData.id
      this.form = { ...selectedData }
      this.form.group_ids = selectedData.groups
      console.log(this.form.email)
      this.dialogFormVisible = true
    },

    async handleChange() {
      this.pagination.currentPage = 1
      await this.getAdminUsers()
    },

    async handleCurrentChange(val) {
      this.pagination.currentPage = val
      await this.getAdminUsers('changePage')
    },
    async handleSizeChange(pageSize) {
      this.pagination.pageSize = pageSize
      await this.getAdminUsers('changePage')
    },
    handleDelete(val) {
      let res
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        this.loading = true
        res = await Admin.deleteOneUser(val.row.id).finally(() => {
          this.loading = false
        })
        if (res.code < window.MAX_SUCCESS_CODE) {
          if (this.total_nums % this.pageCount === 1 && this.currentPage !== 1) {
            this.currentPage--
          }
          await this.getAdminUsers()
          this.$message({
            type: 'success',
            message: `${res.message}`,
          })
        }
      })
    },
    confirmEdit() {
      if (this.activeTab === '修改信息') {
        this.$refs.userInfo.submitForm('form')
      } else {
        this.$refs.password.submitForm('form')
      }
    },
    handleClose() {
      this.dialogFormVisible = false
    },
    handleClick(tab) {
      this.activeTab = tab.name
    },
    async handleInfoResult(flag) {
      this.dialogFormVisible = false
      if (flag === true) {
        this.getAdminUsers()
      }
    },
    handlePasswordResult(result) {
      if (result === true) {
        this.dialogFormVisible = false
      }
    },
    async addUser(flag) {
      if (flag === true) {
        if (this.pagination.pageTotal % this.pagination.pageSize === 0) {
          this.pagination.currentPage++
        }
        await this.getAdminUsers()
      }
    },
  },
  async created() {
    await this.getAdminUsers()
    this.getAllGroups()
    this.tableColumn = [
      { prop: 'username', label: '用户名', width: 200 },
      { prop: 'nickname', label: '昵称', width: 200 },
      { prop: 'active', label: '状态', width: 100, scopedSlots: { customRender: 'active' } },
      { prop: 'email', label: '邮箱', width: 200 },
      { prop: 'groups', label: '所属分组', scopedSlots: { customRender: 'groups' } },
      {
        prop: 'create_time',
        label: '创建时间',
        scope: 'create_time',
        width: 160,
        scopedSlots: { customRender: 'create_time' },
      },
    ]
    this.operate = [
      { name: '编辑', func: 'handleEdit', type: 'primary' },
      { name: '删除', func: 'handleDelete', type: 'danger' },
    ]
  },
  beforeDestroy() {},
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/list.scss';

.password {
  margin-top: 20px;
}
</style>
