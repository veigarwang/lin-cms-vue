<template>
  <div>
    <div class="container" v-if="!showEdit">
      <div class="header">
        <div class="header-left">
          <div class="title">标签管理</div>
        </div>
        <div class="header-right">
          <el-input size="medium" style="margin-right:30px" v-model="pagination.tag_name" placeholder="标签名"></el-input>
          <el-button type="primary" icon="Edit" v-permission="'新增标签'" @click="() => {
            this.showEdit = true;
            this.id = 0;
          }">新增标签</el-button>
          <el-button type="default" icon="Search" @click="refresh">刷新</el-button>
        </div>
      </div>
      <!-- 表格 -->
      <lin-table :tableColumn="tableColumn" :tableData="tableData" :operate="operate" :operateWidth="230"
        @handleEdit="handleEdit" @handleDelete="handleDelete" @handleCorrect="handleCorrect" v-loading="loading"
        :pagination="pagination" @currentChange="handleCurrentChange">
        <template v-slot:status="scope">
          <el-switch v-model="scope.row.status" disabled active-color="#13ce66"></el-switch>
        </template>
        <template v-slot:thumbnail_display="scope">
          <div class="thumb" :style="'background-image: url(' + scope.row.thumbnail_display + ');'"></div>
        </template>
      </lin-table>
      <!--表格结束-->
    </div>
    <tag-form v-else :id="id" ref="tagForm" @editClose="editClose"></tag-form>
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue'
import LinTable from '@/component/base/table/lin-table'
import tagApi from '../../model/tag'
import TagForm from './tag-form'

export default {
  name: 'TagList',
  components: { LinTable, TagForm },
  inject: ['eventBus'],
  data() {
    return {
      id: 0,
      showEdit: false,
      tableData: [], // 表格数据
      tableColumn: [], // 表头数据
      operate: [], // 表格按键操作区
      loading: false,
      pagination: {
        pageSize: 10,
        pageTotal: 0,
        currentPage: 1, // 默认获取第一页的数据
      },
    }
  },
  methods: {
    async getTags() {
      const currentPage = this.pagination.currentPage - 1
      this.loading = true
      const res = await tagApi
        .getTags({
          count: this.pagination.pageSize,
          page: currentPage,
          tag_name: this.pagination.tag_name,
        })
        .finally(() => {
          this.loading = false
        })
      this.tableData = [...res.items]
      this.pagination.pageTotal = res.total
    },
    async handleEdit(val) {
      this.showEdit = true
      this.id = val.row.id
    },
    async handleCurrentChange(val) {
      this.pagination.currentPage = val
      this.loading = true
      await this.getTags()
      this.loading = false
    },
    handleDelete(val) {
      let res
      this.$confirm('此操作将永久删除该标签项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.loading = true
          res = await tagApi.deleteTag(val.row.id)
        } catch (e) {
          this.loading = false
        }
        if (res.code === 0) {
          this.loading = false
          await this.getTags()

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
      await this.getTags()
    },
    // 下拉框选择分组
    async handleChange() {
      this.currentPage = 1
      this.loading = true
      await this.getTags()
      this.loading = false
    },
    async editClose() {
      this.showEdit = false
      await this.getTags()
    },
    async handleCorrect(val) {
      await tagApi.correctTagCount(val.row.id)
      await this.getTags()
    },
  },
  async created() {
    this.tableColumn = [
      { prop: 'tag_name', label: '名称' },
      { prop: 'alias', label: '别名' },
      { prop: 'article_count', label: '文章数量', width: '100' },
      {
        prop: 'status',
        label: '状态',
        scopedSlots: { customRender: 'status' },
      },
      {
        prop: 'thumbnail_display',
        label: '封面',
        scopedSlots: { customRender: 'thumbnail_display' },
      },
      {
        prop: 'create_time',
        label: '创建时间',
        scope: 'create_time',
        customRender(row, column) {
          const { appContext } = getCurrentInstance()
          return appContext.config.globalProperties.$filters.filterTimeYmdHms(column)
        },
      },
    ]
    this.operate = [
      { name: '编辑', func: 'handleEdit', type: 'primary', permission: '编辑标签' },
      { name: '删除', func: 'handleDelete', type: 'danger', permission: '删除标签' },
      { name: '校正数量', func: 'handleCorrect', type: 'default', permission: '校正文章数量' },
    ]

    await this.getTags()
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/list.scss';
</style>
