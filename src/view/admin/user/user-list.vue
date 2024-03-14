<template>
  <div class="container">
    <div class="header">
      <div class="header-left">
        <div class="title">用户列表</div>
      </div>
      <div class="header-right">
        <div style="margin-left:30px">
          <el-select size="medium" filterable v-model="group_id" placeholder="请选择分组" @change="handleChange" clearable
            style="margin-right:30px">
            <el-option v-for="(group, index) in groups" :key="index" :label="group.name" :value="group.id"></el-option>
          </el-select>
          <el-button type="default" icon="Search" @click="getAdminUsers">刷新</el-button>
        </div>
      </div>
    </div>
    <lin-table :tableColumn="tableColumn" :tableData="tableData" :operate="operate" @handleEdit="handleEdit"
      @handleDelete="handleDelete" @row-click="rowClick" v-loading="loading" @currentChange="handleCurrentChange"
      @sizeChange="handleSizeChange" :pagination="pagination">
      <template v-slot:active="scope">
        <el-switch v-model="scope.row.active" disabled active-color="#13ce66" :active-value="1" :inactive-value="2">
        </el-switch>
      </template>
      <template v-slot:create_time="scope">
        <span>{{ $filters.filterTimeYmdHms(scope.row.create_time) }}</span>
      </template>
      <template v-slot:groups="scope">
        <el-tag style="margin-right:1px;" size="small" v-for="(item, index) in scope.row.groups" v-bind:key="index"
          type="primary">{{ item.name }}</el-tag>
      </template>
    </lin-table>
    <el-dialog title="用户信息" :append-to-body="true" :before-close="handleClose" v-model="dialogFormVisible"
      :close-on-click-modal="false">
      <div style="margin-top:-25px;">
        <el-tabs v-model="activeTab" @tab-click="handleClick">
          <el-tab-pane label="修改信息" name="修改信息">
            <user-info ref="userInfo" @handleInfoResult="handleInfoResult"
              labelPosition="right" pageType="edit" :id="id" :groups="groups" :info="form" :submit="false"
              class="info" />
          </el-tab-pane>
          <el-tab-pane label="修改密码" name="修改密码">
            <user-password ref="password" @handlePasswordResult="handlePasswordResult"  :id="id" class="password" />
          </el-tab-pane>
        </el-tabs>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="default" @click="handleClose">取消</el-button>
          <el-button type="primary" @click="confirmEdit">确定</el-button>
        </div>
      </template>

    </el-dialog>
  </div>
</template>

<script>
import Admin from '@/lin/model/admin'
import LinTable from '@/component/base/table/lin-table'
import UserInfo from './user-info'
import UserPassword from './user-password'
export default {
  components: { LinTable, UserInfo, UserPassword },
  inject: ['eventBus'],
  data() {
    window.th= this;
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
      res = await Admin.getAdminUsers({
        count: this.pagination.pageSize,
        page: currentPage,
        group_id: this.group_id,
      })
      this.loading = false
      this.tableData = res.items
      this.pagination.pageTotal = res.count
    },
    async getAllGroups() {
      this.loading = true
      this.groups = await Admin.getAllGroups().finally(() => {
        this.loading = false
      })
    },
    // 获取所拥有的权限并渲染  由子组件提供
    async handleEdit(val) {
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
    rowClick(row) {
      this.handleEdit(row)
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
    this.eventBus.$on('addUser', this.addUser)
  },
  beforeDestroy() {
    this.eventBus.$off('addUser', this.addUser)
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/list.scss';

.password {
  margin-top: 20px;
}
</style>
