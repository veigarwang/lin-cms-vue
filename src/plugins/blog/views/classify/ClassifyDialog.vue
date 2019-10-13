<template>
  <el-dialog
    width="30%"
    :append-to-body="true"
    :before-close="handleClose"
    :visible.sync="dialogFormVisible"
  >
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
        <el-form-item label="专栏名称" prop="classify_name">
          <el-input size="medium" clearable v-model="form.classify_name"></el-input>
        </el-form-item>
        <el-form-item label="专栏编码" prop="classify_code">
          <el-input size="medium" clearable v-model="form.classify_code"></el-input>
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
import classifyApi from "../../models/classify";
export default {
  name: "ClassifyDialog",
  components: {},
  data() {
    return {
      id: 0, // id
      dialogFormVisible: false, // 控制弹窗显示
      loading: false,
      form: {
        // 表单信息
        classify_name: "",
        classify_code: "",
        sort_code: 0
      },
      rules: {
        classify_name: [
          { required: true, message: "请输入名称", trigger: "blur" }
        ],
        classify_code: [
          { required: true, message: "请输入编码", trigger: "blur" }
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
          classify_name: "",
          classify_code: "",
          sort_code: 0
        });
        this.id = 0;
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
        return await classifyApi.addClassify(this.form);
      } else {
        return await classifyApi.editClassify(this.id, this.form);
      }
    },
    async confirmEdit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let res;
          this.loading = true;

          res = await this.submitForm().finally(() => {
            this.loading = false;
          });

          this.$message.success(`${res.msg}`);
          this.dialogFormVisible = false;
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
  async created() {}
};
</script>

<style lang="scss" scoped>
</style>
