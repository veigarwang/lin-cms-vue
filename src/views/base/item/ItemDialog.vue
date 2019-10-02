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
import baseApi from "@/models/base";
export default {
  name: "ItemDialog",
  components: {},
  data() {
    return {
      id: 0, // id
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
    show(record) {
      if (record) {
        Object.assign(this.form, record);
        this.id = record.id;
      } else {
        Object.assign(this.form, {
          item_code: "",
          item_name: "",
          sort_code: 0,
          base_type_id: ""
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
        return await baseApi.addItem(this.form);
      } else {
        return await baseApi.editItem(this.id, this.form);
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
  async created() {
    this.types = await baseApi.getTypes();
  }
};
</script>

<style lang="scss" scoped>
</style>
