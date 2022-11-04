<template>
  <div class="container">
    <div class="header">
      <div class="header-left">
        <div class="title">用户列表</div>
      </div>
      <!-- 分组选择下拉框 -->
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
    <!-- 表格 -->
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
    <!-- 弹窗 -->
    <el-dialog title="用户信息" :append-to-body="true" :before-close="handleClose" v-model="dialogFormVisible"
      :close-on-click-modal="false">
      <div style="margin-top:-25px;">
        <el-tabs v-model="activeTab" @tab-click="handleClick">
          <el-tab-pane label="修改信息" name="修改信息">
            <user-info ref="userInfo" v-if="dialogFormVisible" @handleInfoResult="handleInfoResult"
              labelPosition="right" pageType="edit" :id="id" :groups="groups" :info="form" :submit="false"
              class="info" />
          </el-tab-pane>
          <el-tab-pane label="修改密码" name="修改密码">
            <user-password @handlePasswordResult="handlePasswordResult" ref="password" :id="id" class="password" />
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 按键操作 -->
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
    return {
      id: 0, // 用户id
      editIndex: null, // 编辑的行
      tableData: [], // 表格数据
      tableColumn: [], // 表头数据
      operate: [], // 表格按键操作区
      dialogFormVisible: false, // 控制弹窗显示
      selectGroup: '', // 选中的分组Id
      groups: [], // 所有分组
      group_id: undefined,
      activeTab: '修改信息',
      pagination: {
        pageSize: 10,
        pageTotal: 0,
        currentPage: 1, // 默认获取第一页的数据
      },
      form: {
        // 表单信息
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
    // 根据分组 刷新/获取分组内的用户
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
      this.pagination.pageTotal = res.total
    },
    // 获取所有分组
    async getAllGroups() {
      this.loading = true
      this.groups = await Admin.getAllGroups()
      this.loading = false
    },
    // 获取所拥有的权限并渲染  由子组件提供
    async handleEdit(val) {
      this.editIndex = val.index
      let selectedData
      // 单击 编辑按键
      if (val.index >= 0) {
        selectedData = val.row
      } else {
        // 单击 table row
        selectedData = val
      }
      this.id = selectedData.id
      this.form = { ...selectedData }
      this.form.group_ids = selectedData.groups
      this.dialogFormVisible = true
    },
    // 下拉框选择分组
    async handleChange() {
      this.pagination.currentPage = 1
      await this.getAdminUsers()
    },
    // 切换table页
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
        try {
          this.loading = true
          res = await Admin.deleteOneUser(val.row.id)
          this.loading = false
          if (res.code < window.MAX_SUCCESS_CODE) {
            if (this.total_nums % this.pageCount === 1 && this.currentPage !== 1) {
              // 判断删除的是不是每一页的最后一条数据
              this.currentPage--
            }
            await this.getAdminUsers()
            this.$message({
              type: 'success',
              message: `${res.message}`,
            })
          }
        } catch (e) {
          this.loading = false
        }
      })
    },
    // 提交表单信息
    async confirmEdit() {
      if (this.activeTab === '修改信息') {
        await this.$refs.userInfo.submitForm('form')
      } else {
        await this.$refs.password.submitForm('form')
      }
    },
    // 双击 table ro
    rowClick(row) {
      this.handleEdit(row)
    },
    // 弹框 右上角 X
    handleClose() {
      this.dialogFormVisible = false
    },
    // 切换tab栏
    handleClick(tab) {
      this.activeTab = tab.name
    },
    // 监听子组件更新用户信息是否成功
    async handleInfoResult(flag) {
      this.dialogFormVisible = false
      if (flag === true) {
        this.getAdminUsers()
      }
    },
    // 监听子组件更新密码是否成功
    handlePasswordResult(result) {
      if (result === true) {
        this.dialogFormVisible = false
      }
    },
    // 监听添加用户是否成功
    async addUser(flag) {
      if (flag === true) {
        if (this.pagination.pageTotal % this.pagination.pageSize === 0) {
          // 判断当前页的数据是不是满了，需要增加新的页码
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
    ] // 设置表头信息
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
