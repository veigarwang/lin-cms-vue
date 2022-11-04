<template>
  <div>
    <div class="container" v-if="!showEdit">
      <div class="header">
        <div class="header-left">
          <div class="title">技术频道列表</div>
        </div>

        <div class="header-right">
          <el-input size="medium" style="margin-right:10px;" v-model="pagination.channel_name" placeholder="技术频道">
          </el-input>

          <el-button type="primary" icon="Edit" v-permission="'新增技术频道'" @click="() => {
            showEdit = true;
            this.id = 0;
          }">新增技术频道</el-button>
          <!-- this.$refs['channelForm'].show(0); -->
          <el-button type="default" icon="Search" @click="refresh">查询</el-button>
        </div>
      </div>
      <!-- 表格 -->
      <lin-table :tableColumn="tableColumn" :tableData="tableData" :operate="operate" v-loading="loading"
        :pagination="pagination" @handleEdit="handleEdit" @handleDelete="handleDelete"
        @currentChange="handleCurrentChange">
        <template v-slot:status="scope">
          <el-switch v-model="scope.row.status" disabled active-color="#13ce66"></el-switch>
        </template>
        <template v-slot:tags="scope">
          <el-tag style="margin-right:1px;" size="small" v-for="(tag, index) in scope.row.tags" v-bind:key="index"
            type="success">{{ tag.tag_name }}</el-tag>
        </template>
        <template v-slot:thumbnail_display="scope">
          <div class="thumb" :style="'background-image: url(' + scope.row.thumbnail_display + ');'"></div>
        </template>
      </lin-table>
      <!--表格结束-->
    </div>
    <channel-form ref="channelForm" v-else @editClose="editClose" :id="id"></channel-form>
  </div>
</template>

<script>
import channelApi from '../../model/channel'
import LinTable from '@/component/base/table/lin-table'
import ChannelForm from './channel-form'

export default {
  name: 'ChannelList',
  components: { LinTable, ChannelForm },
  inject: ['eventBus'],
  data() {
    return {
      id: 0,
      showEdit: false,
      editIndex: null, // 编辑的行
      tableData: [], // 表格数据
      tableColumn: [], // 表头数据
      operate: [], // 表格按键操作区
      loading: false,
      pagination: {
        pageSize: 10,
        pageTotal: 0,
        currentPage: 1, // 默认获取第一页的数据
        channel_name: '',
      },
    }
  },
  methods: {
    async getChannels() {
      this.loading = true
      const currentPage = this.pagination.currentPage - 1
      const res = await channelApi
        .getChannels({
          count: this.pagination.pageSize,
          page: currentPage,
          channel_name: this.pagination.channel_name,
        })
        .finally(r => {
          this.loading = false
        })
      this.tableData = [...res.items]
      this.pagination.pageTotal = res.total
    },
    async handleEdit(val) {
      this.showEdit = true
      this.id = val.row.id
      // this.$refs['channelForm'].show(val.row.id)
    },
    // 切换table页
    async handleCurrentChange(val) {
      this.pagination.currentPage = val
      this.loading = true
      await this.getChannels()
      this.loading = false
    },
    handleDelete(val) {
      let res
      this.$confirm('此操作将永久删除该技术频道项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.loading = true
          res = await channelApi.deleteChannel(val.row.id)
        } catch (e) {
          this.loading = false
        }
        if (res.code === 0) {
          this.loading = false
          await this.getChannels()

          this.$message({
            type: 'success',
            message: `${res.message}`,
          })
        } else {
          this.loading = false
          this.$message.error(`${res.message}`)
        }
      })
    },
    async refresh() {
      await this.getChannels()
    },
    // 下拉框选择分组
    async handleChange() {
      this.currentPage = 1
      this.loading = true
      await this.getChannels()
      this.loading = false
    },

    async editClose() {
      this.showEdit = false
      await this.getChannels()
    },
  },
  async created() {
    this.tableColumn = [
      {
        prop: 'channel_name',
        label: '技术频道',
        width: 100,
      },
      {
        prop: 'thumbnail_display',
        label: '封面',
        scopedSlots: { customRender: 'thumbnail_display' },
        width: 100,
      },
      {
        prop: 'sort_code',
        label: '排序码',
        width: 100,
      },
      {
        prop: 'channel_code',
        label: '编码',
        width: 100,
      },
      {
        prop: 'status',
        label: '状态',
        scopedSlots: { customRender: 'status' },
        width: 100,
      },
      {
        prop: 'tags',
        label: '标签',
        scopedSlots: { customRender: 'tags' },
      },
    ]
    this.operate = [
      { name: '编辑', func: 'handleEdit', type: 'primary', permission: '编辑技术频道' },
      { name: '删除', func: 'handleDelete', type: 'danger', permission: '删除技术频道' },
    ]

    await this.getChannels()
  },
  beforeDestroy() { },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/list.scss';
</style>
