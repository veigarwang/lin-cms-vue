<template>
  <el-dialog
    width="500px"
    :title="title"
    :append-to-body="true"
    :before-close="handleClose"
    v-model="dialogFormVisible"
    class="user-dialog"
  >
    <el-form status-icon ref="form" label-width="100px" :model="form" :rules="rules">
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
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" :loading="loading" @click="submitForm('form')">保存</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import tagApi from '../../model/tag'
import UploadImgs from '@/component/base/upload-image'
export default {
  name: 'TagForm',
  components: { UploadImgs },
  props: {},
  computed: {
    title() {
      return this.id == 0 ? '新增标签' : '编辑标签'
    },
  },
  data() {
    return {
      id: 0,
      dialogFormVisible: false,
      loading: false,
      form: {
        tag_name: '',
        alias: '',
        thumbnail: '',
        status: true,
      },
      thumbnailPreview: [],
      rules: {
        tag_name: [{ required: true, message: '请输入标签', trigger: 'blur' }],
        thumbnail: [{ required: true, message: '请上传封面', trigger: 'blur' }],
      },
    }
  },
  methods: {
    show(id) {
      this.dialogFormVisible = true
      this.getTag(id)
    },
    handleClose(done) {
      this.dialogFormVisible = false
      done()
    },
    async getTag(id) {
      this.id = id
      if (this.id != 0) {
        const tag = await tagApi.getTag(this.id)
        this.form = tag
        this.thumbnailPreview.length = 0
        if (tag.thumbnail) {
          this.thumbnailPreview = [
            {
              id: tag.id,
              display: tag.thumbnail_display,
              src: tag.thumbnail,
              imgId: tag.id,
            },
          ]
        }
      } else {
        Object.assign(this.form, {
          tag_name: '',
          alias: '',
          status: true,
        })
      }
    },
    async submitForm(formName) {
      const thumbnail = await this.$refs['thumbnail'].getValue()
      if (thumbnail.length > 0) {
        this.form.thumbnail = thumbnail[0].src
      } else {
        this.form.thumbnail = ''
      }
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.loading = true
          let res
          if (this.id == 0) {
            res = await tagApi.addTag(this.form).finally(() => {
              this.loading = false
            })
          } else {
            res = await tagApi.editTag(this.id, this.form).finally(() => {
              this.loading = false
            })
          }
          this.$message.success(`${res.message}`)
          this.resetForm(formName)
          this.dialogFormVisible = false
          this.$emit('success')
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
