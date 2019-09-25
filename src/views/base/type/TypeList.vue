<template>
  <div class="container">
    <div class="header">
      <div class="header-left">
        <div class="title">字典列表</div>
      </div>

      <div class="header-right">
        <div style="margin-left:30px">
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="()=>{
              this.dialogFormVisible=!this.dialogFormVisible
              this.id=0;
              this.form= {
              }
            }"
          >新增类别</el-button>
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
    ></lin-table>
    <!--表格结束-->
    <el-dialog :append-to-body="true" :before-close="handleClose" :visible.sync="dialogFormVisible">
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
          <el-form-item label="类别编码" prop="type_code">
            <el-input size="medium" clearable v-model="form.type_code"></el-input>
          </el-form-item>
          <el-form-item label="类别名称" prop="full_name">
            <el-input size="medium" clearable v-model="form.full_name"></el-input>
          </el-form-item>
          <el-form-item label="排序码" prop="sort_code">
            <el-input size="medium" type="number" clearable v-model="form.sort_code"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer" style="padding-left:5px;">
        <el-button type="primary" @click="confirmEdit('form')">确 定</el-button>
        <el-button @click="resetForm('form')">重 置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import baseApi from "@/models/base";
import LinTable from "@/components/base/table/lin-table";
import { setTimeout } from "timers";
import Vue from "vue";
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
        type_code: "",
        full_name: "",
        sort_code: 0
      },
      rules: {
        // 表单验证规则
        type_code: [
          { required: true, message: "请输入类别编码", trigger: "blur" }
        ],
        full_name: [
          { required: true, message: "请输入类别名称", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 弹框 右上角 X
    handleClose(done) {
      this.dialogFormVisible = false;
      done();
    },
    // 根据分组 刷新/获取分组内的用户
    async getBaseTypes() {
      let res;
      try {
        this.loading = true;
        res = await baseApi.getTypes({});
        setTimeout(() => {
          this.loading = false;
        }, 500);
        this.tableData = res;
      } catch (e) {
        this.loading = false;
      }
    },
    async handleEdit(val) {
      var rowData = val.row;
      this.id = val.row.id;
      this.dialogFormVisible = true;
      Object.assign(this.form, rowData);
    },
    handleDelete(val) {
      this.$confirm("此操作将永久删除该字典项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        this.loading = true;
        await baseApi.deleteType(val.row.id).finally(() => {
          this.loading = false;
        });

        await this.getBaseTypes();
        this.$message({
          type: "success",
          message: `${res.msg}`
        });
      });
    },
    async submitForm() {
      if (this.id === 0) {
        return await baseApi.addType(this.form);
      } else {
        return await baseApi.editType(this.id, this.form);
      }
    },
    async confirmEdit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.loading = true;

          let res = await this.submitForm().finally(() => {
            this.loading = false;
          });
          this.dialogFormVisible = false;
          await this.getBaseTypes();
          this.$message.success(`${res.msg}`);
        } else {
          this.$message.error("请填写正确的信息");
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    async refresh() {
      await this.getBaseTypes();
    },
    // 下拉框选择分组
    async handleChange() {
      this.currentPage = 1;
      this.loading = true;
      await this.getBaseTypes();
      this.loading = false;
    }
  },
  async created() {
    this.tableColumn = [
      { prop: "type_code", label: "编码" },
      { prop: "full_name", label: "名称" },
      { prop: "sort_code", label: "排序码" },
      {
        prop: "create_time",
        label: "创建时间",
        scope: "create_time",
        formatter: function(row, column) {
          return Vue.filter("filterTimeYmdHms")(column);
        }
      }
    ];
    this.operate = [
      { name: "编辑", func: "handleEdit", type: "primary" },
      { name: "删除", func: "handleDelete", type: "danger" }
    ];

    await this.getBaseTypes();
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
