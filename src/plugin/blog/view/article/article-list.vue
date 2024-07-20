<template>
  <div>
    <el-card class="container" v-if="!showEdit">
      <el-form ref="form" :model="pagination" :inline="true">
        <el-form-item label="标题" prop="title">
          <el-input
            size="medium"
            clearable
            style="margin-right: 30px"
            v-model="pagination.title"
            placeholder="标题"
          ></el-input>
        </el-form-item>
        <el-form-item label="Id" prop="articleId">
          <el-input
            size="medium"
            clearable
            style="margin-right: 30px"
            v-model="pagination.articleId"
            placeholder="Id"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default" icon="Search" @click="getArticles">查询</el-button>
        </el-form-item>
      </el-form>
      <lin-table
        :tableColumn="tableColumn"
        :tableData="tableData"
        :operate="operate"
        @handleEdit="handleEdit"
        @handleDelete="handleDelete"
        v-loading="loading"
        :pagination="pagination"
        @currentChange="handleCurrentChange"
      ></lin-table>
    </el-card>
  </div>
</template>

<script>
import LinTable from '@/component/base/table/lin-table'
import articleApi from '../../model/article'
import ArticleForm from './article-form'

function format_str() {
  for (let i = 1; i < arguments.length; i++) {
    let exp = new RegExp('\\{' + (i - 1) + '\\}', 'gm')
    arguments[0] = arguments[0].replace(exp, arguments[i])
  }
  return arguments[0]
}

function image_preview_dialog(url) {
  console.log(url)
}

export default {
  name: 'articleList',
  components: { LinTable, ArticleForm },
  data() {
    return {
      id: 0,
      showEdit: false,
      refreshPagination: true,
      tableData: [],
      tableColumn: [],
      operate: [],
      activeTab: '修改信息',
      loading: false,
      pagination: {
        pageSize: 10,
        pageTotal: 0,
        currentPage: 1,
        title: '',
        articleId: null,
      },
    }
  },
  methods: {
    editClose() {
      this.showEdit = false
      this.getArticles()
    },
    async getArticles() {
      let res
      const currentPage = this.pagination.currentPage - 1
      this.loading = true
      res = await articleApi
        .getAllArticles({
          count: this.pagination.pageSize,
          page: currentPage,
          title: this.pagination.title,
          articleId: this.pagination.articleId,
        })
        .finally(() => {
          this.loading = false
        })
      this.tableData = [...res.items]
      this.pagination.pageTotal = res.count
    },
    async handleEdit(val) {
      window.open(`/#/cms/article/form?id=${val.row.id}`)
      // this.$router.push({
      //   name: 'ArticleForm',
      //   query: { id: val.row.id },
      // })
    },

    async handleCurrentChange(val) {
      this.pagination.currentPage = val
      this.loading = true
      await this.getArticles()
      this.loading = false
    },
    handleDelete(val) {
      let res
      this.$confirm('此操作将永久删除该随笔, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        this.loading = true
        res = await articleApi.deleteCmsArticle(val.row.id)
        this.loading = false

        this.$message({
          type: 'success',
          message: `${res.message}`,
        })
        await this.getArticles()
      })
    },
  },
  async created() {
    await this.getArticles()
    this.tableColumn = [
      { prop: 'title', label: '标题', width: 400 },
      { prop: 'comment_quantity', label: '评论数', width: 70 },
      { prop: 'likes_quantity', label: '点赞数', width: 70 },
      { prop: 'view_hits', label: '阅读数', width: 70 },
      { prop: 'time_span', label: '发布时间', width: 170 },
      {
        prop: 'id',
        label: '状态',
        customRender: function (row, column) {
          let isaudit = format_str(
            '<i title="{0}" class="el-icon-{1}"></i>',
            row.is_audit ? '已审核' : '拉黑',
            row.is_audit ? 'check' : 'close',
          )

          let isremd = format_str(
            '<i  style="margin-left:10px;" title="{0}" class="el-icon-{1}"></i>',
            row.is_stickie ? '置顶' : '未置顶',
            row.is_stickie ? 'top' : 'bottom',
          )

          let isstickie = format_str(
            '<i  style="margin-left:10px;" title="{0}" class="el-icon-{1}"></i>',
            row.recommend ? '推荐' : '未推荐',
            row.recommend ? 'thumb' : 'ice-cream-square',
          )
          return isaudit + isremd + isstickie
        },
      },
      {
        prop: 'is_audit',
        label: '关键字/来源/摘要/缩略图',
        customRender: function (row, column) {
          let d = format_str(
            '<i class="el-icon-{0}"></i><i class="el-icon-{1}" style="margin-left:10px;"></i><i class="el-icon-{2}" style="margin-left:10px;"></i>',
            row.keywords ? 'check' : 'close',
            row.source ? 'check' : 'close',
            row.excerpt ? 'check' : 'close',
          )
          if (row.thumbnail) {
            let thumurl = format_str('<i class="el-icon-picture"  style="margin-left:10px;"></i>', row.thumbnail)
            d += thumurl
          }
          return d
        },
      },
    ]

    this.operate = [
      { name: '审核', func: 'handleEdit', type: 'primary', permission: '审核随笔' },
      { name: '删除', func: 'handleDelete', type: 'danger', permission: '删除随笔' },
    ]
  },
  beforeDestroy() {},
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header-left {
      float: left;

      .title {
        height: 59px;
        line-height: 59px;
        color: #4c76af;
        font-size: 16px;
        font-weight: 500;
      }
    }

    .header-right {
      float: right;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
}
</style>
