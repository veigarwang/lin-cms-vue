<template>
  <div class="container">
    <div class="header">
      <div class="header-left">
        <div class="title">字典列表</div>
      </div>
      <div class="header-right">
        <div style="margin-left:30px">
          <el-button type="primary" @click="dialogFormVisible=!dialogFormVisible">新增字典</el-button>
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
      @row-click="rowClick"
      v-loading="loading"
    ></lin-table>
    <!--表格结束-->
    <el-dialog :append-to-body="true" :visible.sync="dialogFormVisible">
      <div style="margin-top:-25px;">
        <el-form
          status-icon
          v-if="dialogFormVisible"
          ref="form"
          label-width="120px"
          :model="form"
          label-position="labelPosition"
          :rules="rules"
          style="margin-left:-35px;margin-bottom:-35px;margin-top:15px;"
        >
          <el-form-item label="分组名称" prop="name">
            <el-input size="medium" clearable v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="分组描述" prop="info">
            <el-input size="medium" clearable v-model="form.info"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer" style="padding-left:5px;">
        <el-button type="primary" @click="confirmEdit">确 定</el-button>
        <el-button @click="resetForm('form')">重 置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import baseApi from "@/models/base";
import LinTable from "@/components/base/table/lin-table";

export default {
  components: { LinTable },
  inject: ["eventBus"],
  data() {
    return {
      id: 0, // id
      refreshPagination: true, // 页数增加的时候，因为缓存的缘故，需要刷新Pagination组件
      editIndex: null, // 编辑的行
      tableData: [], // 表格数据
      tableColumn: [], // 表头数据
      operate: [], // 表格按键操作区
      dialogFormVisible: false, // 控制弹窗显示
      loading: false,
      form: {
        // 表单信息
        name: "",
        info: ""
      },
      rules: {
        // 表单验证规则
        name: [{ required: true, message: "请输入分组名称", trigger: "blur" }],
        info: []
      }
    };
  },
  methods: {
    // 根据分组 刷新/获取分组内的用户
    async getBaseItems() {
      let res;
      try {
        this.loading = true;
        res = await baseApi.getBaseItems({
          typeCode: "tag"
        });
        this.loading = false;
        this.tableData = res;
      } catch (e) {
        this.loading = false;
      }
    },
    async handleEdit(val) {
      this.editIndex = val.index;
      let selectedData;
      // 单击 编辑按键
      if (val.index >= 0) {
        selectedData = val.row;
      } else {
        // 单击 table row
        selectedData = val;
      }
      this.dialogFormVisible = true;
      // this.$router.push({ name: "articleFormAdd" });
      // this.$router.push({
      //   name: "baseItemFormEdit",
      //   params: { id: selectedData.id }
      // });
    },
    handleDelete(val) {
      let res;
      this.$confirm("此操作将永久删除该字典项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        try {
          this.loading = true;
          res = await baseApi.deleteBaseItem(val.row.id);
        } catch (e) {
          this.loading = false;
          console.log(e);
        }
        if (res.error_code === 0) {
          this.loading = false;
          await this.getBaseItems();

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
    rowClick(row) {
      this.handleEdit(row);
    },
    async confirmEdit() {}
  },
  async created() {
    await this.getBaseItems();
    this.tableColumn = [
      { prop: "item_code", label: "编码" },
      { prop: "item_name", label: "名称" },
      { prop: "sort_code", label: "排序码" }
    ];
    this.operate = [
      { name: "编辑", func: "handleEdit", type: "primary" },
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
}

.info {
  margin-left: -55px;
  margin-bottom: -30px;
}
</style>
