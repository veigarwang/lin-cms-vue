<template>
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
</template>
<script>
import baseApi from "../../models/base";
export default {
  name: "TypeDialog",
  data() {
    return {
      id: 0, // id
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
    show(record) {
      if (record) {
        Object.assign(this.form, record);
        this.id = record.id;
      } else {
        Object.assign(this.form, {
          type_code: "",
          full_name: "",
          sort_code: 0
        });
      }
      this.dialogFormVisible = true;
    },
    // 弹框 右上角 X
    handleClose(done) {
      this.dialogFormVisible = false;
      done();
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
          this.$message.success(`${res.msg}`);
          this.resetForm(formName);
          this.$emit("ok");
        } else {
          this.$message.error("请填写正确的信息");
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  async created() {},
  beforeDestroy() {}
};
</script>
<style scoped>
</style>