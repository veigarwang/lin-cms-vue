<template>
  <div class="container">
    <div class="header">
      <div class="header-left">
        <div class="title">随笔列表</div>
      </div>
      <div class="header-right">
        <div style="margin-left:30px">
          <el-button type="default" icon="el-icon-search" @click="getComments">刷新</el-button>
        </div>
      </div>
    </div>
    <!-- 表格 -->
    <lin-table
      :tableColumn="tableColumn"
      :tableData="tableData"
      :operate="operate"
      @handleDetail="handleDetail"
      @handleDelete="handleDelete"
      @row-click="rowClick"
      v-loading="loading"
      :pagination="pagination"
      @currentChange="handleCurrentChange"
    ></lin-table>
    <comment-dialog ref="dialogForm"></comment-dialog>
  </div>
</template>

<script>
import LinTable from "@/components/base/table/lin-table";
import CommentDialog from "./CommentDialog";
import commentApi from "../../models/comment";
export default {
  name: "CommentList",
  components: { LinTable, CommentDialog },
  inject: ["eventBus"],
  data() {
    return {
      id: 0, // 用户id
      refreshPagination: true, // 页数增加的时候，因为缓存的缘故，需要刷新Pagination组件
      editIndex: null, // 编辑的行
      // total: 0, // 分组内的用户总数
      tableData: [], // 表格数据
      tableColumn: [], // 表头数据
      operate: [], // 表格按键操作区
      dialogFormVisible: false, // 控制弹窗显示
      selectGroup: "", // 选中的分组Id
      groups: [], // 所有分组
      group_id: undefined,
      activeTab: "修改信息",
      loading: false,
      pagination: {
        pageSize: 10,
        pageTotal: 0,
        currentPage: 1 // 默认获取第一页的数据
      }
    };
  },
  methods: {
    // 根据分组 刷新/获取分组内的用户
    async getComments() {
      let res;
      const currentPage = this.pagination.currentPage - 1;
      try {
        this.loading = true;
        res = await commentApi.getComments({
          count: this.pagination.pageSize,
          page: currentPage
        });
        this.loading = false;
        this.tableData = [...res.items];
        this.pagination.pageTotal = res.total;
      } catch (e) {
        this.loading = false;
        console.log(e);
      }
    },
    buttonMethods(func, index, row) {
      console.log(func, index, row);
    },
    async handleDetail(val) {
      let selectedData;
      // 单击 编辑按键
      if (val.index >= 0) {
        this.editIndex = val.index;
        selectedData = val.row;
      } else {
        // 单击 table row
        selectedData = val;
      }
      console.log(selectedData);
      this.$refs["dialogForm"].show(selectedData);
      // this.$router.push("/comment/form/" + selectedData.id);
    },
    // 切换table页
    async handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.loading = true;
      await this.getComments();
      this.loading = false;
    },
    handleDelete(val) {
      let res;
      this.$confirm("此操作将永久删除该评论, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        try {
          this.loading = true;
          res = await commentApi.delectComment(val.row.id);
        } catch (e) {
          this.loading = false;
          console.log(e);
        }
        if (res.error_code === 0) {
          this.loading = false;
          if (
            this.pagination.pageTotal % this.pagination.pageSize === 1 &&
            this.pagination.currentPage !== 1
          ) {
            // 判断删除的是不是每一页的最后一条数据
            this.pagination.currentPage--;
          }
          await this.getComments();
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
    // 双击 table ro
    rowClick(row) {
      this.handleDetail(row);
    }
  },
  async created() {
    await this.getComments();
    this.tableColumn = [
      { prop: "au_name", label: "昵称", width: 100 },
      { prop: "au_email", label: "邮件" },
      { prop: "text", label: "评论内容", width: 400 },
      { prop: "ip", label: "ip" },
      { prop: "agent", label: "User-Agent", width: 300 },
      { prop: "system", label: "系统", width: 100 },
      { prop: "user_host", label: "主机名", width: 100 },
      { prop: "is_audited", label: "状态", width: 100 }
    ]; // 设置表头信息

    this.operate = [
      { name: "查看", func: "handleDetail", type: "primary" },
      { name: "删除", func: "handleDelete", type: "danger" }
    ];
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

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
}

.info {
  margin-left: -55px;
  margin-bottom: -30px;
}
</style>
