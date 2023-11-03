<template>
  <div>
    <sticky-top>
      <div class="title">
        <span>{{ title[this.id == 0 ? 0 : 1] }}</span>
        <span class="back" @click="back">
          <i class="iconfont icon-fanhui"></i> 返回
        </span>
      </div>
    </sticky-top>
    <div class="container">
      <div class="wrap">
        <el-row>
          <el-col :lg="16" :md="20" :sm="24" :xs="24">
            <el-form status-icon ref="form" label-width="120px" :model="form" label-position="labelPosition"
              :rules="rules" style="margin-left:-35px;margin-bottom:-35px;margin-top:15px;">
              <el-form-item label="文档名" prop="name">
                <el-input size="medium" clearable v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="显示名" prop="display_name">
                <el-input size="medium" clearable v-model="form.display_name"></el-input>
              </el-form-item>
              <el-form-item class="submit">
                <el-button type="primary" @click="confirmEdit('form')">保 存</el-button>
                <el-button @click="resetForm('form')">重 置</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import docApi from '../../model/doc'
export default {
  name: 'DocForm',
  props: {},
  data() {
    return {
      title: ['新增文档', '编辑文档'],
      loading: false,
      // 表单信息
      form: {
        name: '',
        display_name: '',
      },
      // 表单验证规则
      rules: {
        doc_name: [{ required: true, message: '请输入文档', trigger: 'blur' }],
      },
    }
  },
  props: {
    id: {
      type: [String, Number],
    },
  },
  async created() {
    this.show()
  },
  methods: {
    async show() {
      if (this.id != 0) {
        let doc = await docApi.getDoc(this.id)
        this.form = doc

      } else {
        Object.assign(this.form, {
          name: '',
          display_name: '',
        })
      }
    },
    async submitForm() {
      if (this.id == 0) {
        return await docApi.addDoc(this.form)
      } else {
        return await docApi.editDoc(this.id, this.form)
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
          this.$emit('editClose')
        } else {
          this.$message.error('请填写正确的信息')
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    back() {
      this.$emit('editClose')
    },
  },
}
</script>


<style lang="scss" scoped>
@import '@/assets/style/form.scss';
</style>
