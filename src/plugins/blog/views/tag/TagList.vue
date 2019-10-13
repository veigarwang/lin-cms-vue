<template>
  <div>
    <div class="container" v-if="!showEdit">
      <div class="header">
        <div class="header-left">
          <div class="title">标签管理</div>
        </div>

        <div class="header-right">
          <div style="margin-left:30px">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="()=>{
                this.showEdit = true;
                this.id = 0;
            }"
            >新增标签</el-button>
            <el-button type="default" icon="el-icon-search" @click="refresh">刷新</el-button>
          </div>
        </div>
      </div>
      <!-- 表格 -->
      <lin-table
        :tableColumn="tableColumn"
        :tableData="tableData"
        :operate="operate"
        @handleEdit="handleEdit"
        @handleDelete="handleDelete"
        v-loading="loading"
        :pagination="pagination"
        @currentChange="handleCurrentChange"
      >
        <template v-slot:thumbnail_display="scope">
          <el-image
            v-if="scope.row.thumbnail_display"
            style="width: 50px; height: 50px"
            :src="scope.row.thumbnail_display"
            fit="fit"
          ></el-image>
        </template>
      </lin-table>
      <!--表格结束-->
    </div>
    <tag-form v-else @editClose="editClose" :id="id"></tag-form>
  </div>
</template>

<script>
import tagApi from "../../models/tag";
import LinTable from "@/components/base/table/lin-table";
import TagForm from "./TagForm";
import Vue from "vue";
export default {
  name: "TagList",
  components: { LinTable, TagForm },
  inject: ["eventBus"],
  data() {
    return {
      id: 0,
      showEdit: false,
      refreshPagination: true, // 页数增加的时候，因为缓存的缘故，需要刷新Pagination组件
      editIndex: null, // 编辑的行
      tableData: [], // 表格数据
      tableColumn: [], // 表头数据
      operate: [], // 表格按键操作区
      loading: false,
      pagination: {
        pageSize: 10,
        pageTotal: 0,
        currentPage: 1 // 默认获取第一页的数据
      }
    };
  },
  methods: {
    async getTags() {
      let res;
      const currentPage = this.pagination.currentPage - 1;
      try {
        this.loading = true;
        res = await tagApi.getTags({
          count: this.pagination.pageSize,
          page: currentPage
        });
        this.tableData = [...res.collection];
        this.pagination.pageTotal = res.total_nums;
        setTimeout(() => {
          this.loading = false;
        }, 500);
      } catch (e) {
        this.loading = false;
      }
    },
    async handleEdit(val) {
      this.showEdit = true;
      this.id = val.row.id;
    },
    // 切换table页
    async handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.loading = true;
      await this.getTags();
      this.loading = false;
    },
    handleDelete(val) {
      let res;
      this.$confirm("此操作将永久删除该标签项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        try {
          this.loading = true;
          res = await tagApi.deleteTag(val.row.id);
        } catch (e) {
          this.loading = false;
        }
        if (res.error_code === 0) {
          this.loading = false;
          await this.getTags();

          this.$message({
            type: "success",
            message: `${res.msg}`
          });
        } else {
          this.loading = false;
          this.$message.error(`${res.msg}`);
        }
      });
    },
    async refresh() {
      await this.getTags();
    },
    // 下拉框选择分组
    async handleChange() {
      this.currentPage = 1;
      this.loading = true;
      await this.getTags();
      this.loading = false;
    },

    editClose() {
      this.showEdit = false;
      this.getTags();
    }
  },
  async created() {
    this.tableColumn = [
      { prop: "tag_name", label: "名称" },
      { prop: "alias", label: "别名" },
      {
        prop: "thumbnail_display",
        label: "封面",
        scopedSlots: { customRender: "thumbnail_display" }
      },
      {
        prop: "create_time",
        label: "创建时间",
        scope: "create_time",
        customRender: function(row, column) {
          return Vue.filter("filterTimeYmdHms")(column);
        }
      }
    ];
    this.operate = [
      { name: "编辑", func: "handleEdit", type: "primary" },
      { name: "删除", func: "handleDelete", type: "danger" }
    ];

    await this.getTags();
  },
  beforeDestroy() {}
};
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      height: 59px;
      line-height: 59px;
      color: $parent-title-color;
      font-size: 16px;
      font-weight: 500;
    }
  }
}

.info {
  margin-left: -55px;
  margin-bottom: -30px;
}
</style>
