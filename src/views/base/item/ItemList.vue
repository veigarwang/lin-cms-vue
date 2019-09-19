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
          >新增字典</el-button>
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
          <el-form-item label="类别" prop="base_type_id">
            <el-select
              size="medium"
              filterable
              v-model="form.base_type_id"
              :disabled="types.length === 0"
              placeholder="请选择分组"
            >
              <el-option
                v-for="item in types"
                :key="item.id"
                :label="item.full_name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="编码" prop="item_code">
            <el-input size="medium" clearable v-model="form.item_code"></el-input>
          </el-form-item>
          <el-form-item label="名称" prop="item_name">
            <el-input size="medium" clearable v-model="form.item_name"></el-input>
          </el-form-item>
          <el-form-item label="排序码" prop="sort_code">
            <el-input size="medium" clearable v-model="form.sort_code"></el-input>
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
        item_code: "",
        item_name: "",
        sort_code: 0,
        base_type_id: ""
      },
      rules: {
        // 表单验证规则
        base_type_id: [
          { required: true, message: "请选择类别名称", trigger: "blur" }
        ],
        item_code: [{ required: true, message: "请输入编码", trigger: "blur" }],
        item_name: [{ required: true, message: "请输入名称", trigger: "blur" }]
      },
      types: []
    };
  },
  methods: {
    // 弹框 右上角 X
    handleClose(done) {
      this.dialogFormVisible = false;
      done();
    },
    // 根据分组 刷新/获取分组内的用户
    async getBaseItems() {
      let res;
      try {
        this.loading = true;
        res = await baseApi.getItems({
          typeCode: "tag"
        });
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
      this.form.base_type_id = rowData.base_type_id;
      this.form.item_code = rowData.item_code;
      this.form.item_name = rowData.item_name;
      this.form.sort_code = rowData.sort_code;
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
          res = await baseApi.deleteItem(val.row.id);
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
    async confirmEdit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let res;
          if (this.id === 0) {
            try {
              this.loading = true;
              res = await baseApi.addItem(this.form);
            } catch (e) {
              this.loading = false;
              console.log(e);
            }
            if (res.error_code === 0) {
              this.loading = false;
              this.$message.success(`${res.msg}`);
              this.resetForm(formName);
              this.dialogFormVisible = false;
              await this.getBaseItems();
            } else {
              this.loading = false;
              this.$message.error(`${res.msg}`);
            }
          } else {
            try {
              this.loading = true;
              res = await baseApi.editItem(this.id, this.form);
            } catch (e) {
              this.loading = false;
              console.log(e);
            }
            if (res.error_code === 0) {
              this.loading = false;
              this.$message.success(`${res.msg}`);
              this.dialogFormVisible = false;
              await this.getBaseItems();
            } else {
              this.loading = false;
              this.$message.error(`${res.msg}`);
            }
          }
        } else {
          this.$message.error("请填写正确的信息");
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    async refresh() {
      await this.getBaseItems();
      this.types = await baseApi.getTypes();
    }
  },
  async created() {
    this.tableColumn = [
      { prop: "item_code", label: "编码" },
      { prop: "item_name", label: "名称" },
      { prop: "sort_code", label: "排序码" }
    ];
    this.operate = [
      { name: "编辑", func: "handleEdit", type: "primary" },
      { name: "删除", func: "handleDelete", type: "danger" }
    ];
    await this.getBaseItems();
    this.types = await baseApi.getTypes();
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
