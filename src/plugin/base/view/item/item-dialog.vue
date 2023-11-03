<template>
  <el-dialog title="字典信息" :append-to-body="true" :before-close="handleClose" v-model="dialogFormVisible"
    :close-on-click-modal="false">
    <div style="margin-top:-25px;">
      <el-form status-icon v-if="dialogFormVisible" ref="form" label-width="120px" :model="form"
        label-position="labelPosition" :rules="rules" style="margin-left:-35px;margin-bottom:-35px;margin-top:15px;">
        <el-form-item label="类别" prop="base_type_id">
          <el-select size="medium" filterable v-model="form.base_type_id" :disabled="types.length === 0"
            placeholder="请选择分组">
            <el-option v-for="item in types" :key="item.id" :label="item.full_name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="编码" prop="item_code">
          <el-input size="medium" clearable v-model="form.item_code"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="item_name">
          <el-input size="medium" clearable v-model="form.item_name"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="form.status" active-color="#13ce66" active-text="启用" inactive-text="禁用"></el-switch>
        </el-form-item>
        <el-form-item label="排序码" prop="sort_code">
          <el-input size="medium" type="number" clearable v-model="form.sort_code"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="confirmEdit('form')">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import baseApi from '../../model/base'
export default {
  name: 'ItemDialog',
  components: {},
  data() {
    return {
      id: 0, // id
      dialogFormVisible: false, // 控制弹窗显示
      loading: false,
      form: {
        // 表单信息
        item_code: '',
        item_name: '',
        sort_code: 0,
        base_type_id: '',
        status: true,
      },
      rules: {
        // 表单验证规则
        base_type_id: [{ required: true, message: '请选择类别名称', trigger: 'blur' }],
        item_code: [{ required: true, message: '请输入编码', trigger: 'blur' }],
        item_name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
      },
      types: [],
    }
  },
  methods: {
    show(record) {
      if (record) {
        Object.assign(this.form, record)
        this.id = record.id
      } else {
        Object.assign(this.form, {
          item_code: '',
          item_name: '',
          sort_code: 0,
          base_type_id: '',
          status: true,
        })
        this.id = 0
      }
      this.dialogFormVisible = true
    },
    // 弹框 右上角 X
    handleClose() {
      this.dialogFormVisible = false
    },
    async submitForm() {
      if (this.id === 0) {
        return await baseApi.addItem(this.form)
      } else {
        return await baseApi.editItem(this.id, this.form)
      }
    },
    async confirmEdit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let res
          this.loading = true

          res = await this.submitForm().finally(() => {
            this.loading = false
          })

          this.$message.success(`${res.message}`)
          this.dialogFormVisible = false
          this.$emit('ok')
        } else {
          this.$message.error('请填写正确的信息')
        }
      })
    },
  },
  async created() {
    this.types = await baseApi.getTypes()
  },
}
</script>

<style lang="scss" scoped>

</style>
