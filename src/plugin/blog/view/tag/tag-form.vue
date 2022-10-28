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
              <el-form-item label="标签名称" prop="tag_name">
                <el-input size="medium" clearable v-model="form.tag_name"></el-input>
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input size="medium" clearable v-model="form.remark"></el-input>
              </el-form-item>
              <el-form-item label="别名" prop="alias">
                <el-input size="medium" clearable v-model="form.alias"></el-input>
              </el-form-item>
              <el-form-item label="状态" prop="status">
                <el-switch v-model="form.status" active-color="#13ce66" active-text="启用" inactive-text="禁用"></el-switch>
              </el-form-item>
              <el-form-item label="封面" prop="thumbnail">
                <upload-imgs ref="thumbnail" :multiple="false" :value="thumbnailPreview" :max-num="1" />
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
import tagApi from '../../model/tag'
import UploadImgs from '@/component/base/upload-image'
export default {
  name: 'TagForm',
  components: { UploadImgs },
  props: {},
  data() {
    return {
      title: ['新增标签', '编辑标签'],
      loading: false,
      // 表单信息
      form: {
        tag_name: '',
        alias: '',
        thumbnail: '',
        status: true,
      },
      thumbnailPreview: [],
      // 表单验证规则
      rules: {
        tag_name: [{ required: true, message: '请输入标签', trigger: 'blur' }],
        thumbnail: [{ required: true, message: '请上传封面', trigger: 'blur' }],
      },
    }
  },
  props: {
    id: {
      type: [String, Number],
    },
  },
  async created() {
    await this.show()
  },
  methods: {
    async show() {
      if (this.id != 0) {
        const tag = await tagApi.getTag(this.id)
        this.form = tag
        this.thumbnailPreview.length = 0
        if (tag.thumbnail) {
          this.thumbnailPreview = [{
            id: tag.id,
            display: tag.thumbnail_display,
            src: tag.thumbnail,
            imgId: tag.id,
          }]
        }
      } else {
        Object.assign(this.form, {
          tag_name: '',
          alias: '',
          status: true,
        })
      }
    },
    async submitForm() {
      if (this.id == 0) {
        return await tagApi.addTag(this.form)
      } else {
        return await tagApi.editTag(this.id, this.form)
      }
    },
    async confirmEdit(formName) {
      const thumbnail = await this.$refs['thumbnail'].getValue()
      if (thumbnail.length > 0) {
        this.form.thumbnail = thumbnail[0].src
      } else {
        this.form.thumbnail = ''
      }
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.loading = true
          const res = await this.submitForm().finally(() => {
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
