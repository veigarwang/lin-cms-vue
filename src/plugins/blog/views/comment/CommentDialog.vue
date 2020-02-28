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
        style="margin-left:-35px;margin-bottom:-35px;margin-top:15px;"
      >
        <el-form-item label="用户" prop="nickname">
          <span>{{form.user_info.nickname}}</span>
        </el-form-item>
        <el-form-item label="评论内容" prop="text">
          <span v-html="text"></span>
        </el-form-item>

        <el-form-item label="状态" prop="is_audit">
          <el-radio v-model="form.is_audit" :label="true">审核通过</el-radio>
          <el-radio v-model="form.is_audit" :label="false">拉黑</el-radio>
          <!-- <el-input size="medium" v-model="form.is_audit"></el-input> -->
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer" style="padding-left:5px;">
      <el-button type="primary" @click="confirmEdit('form')">确 定</el-button>
      <el-button type="default" @click="handleClose">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import commentApi from '../../models/comment'
import Utils from '@/lin/utils/util'
export default {
  name: 'CommentDialog',
  data() {
    return {
      dialogFormVisible: false, // 控制弹窗显示
      loading: false,
      form: {
        id: 0,
        avatar: '',
        is_audit: true,
        text: '',
      },
    }
  },
  computed: {
    text() {
      return Utils.formatHtml(Utils.formatHyperLink(this.form.text))
    },
  },
  methods: {
    show(record) {
      Object.assign(this.form, record)
      this.dialogFormVisible = true
    },

    async confirmEdit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.loading = true
          let res = await commentApi
            .editComment(this.form.id, this.form.is_audit)
            .finally(() => {
              this.loading = false
            })
          this.dialogFormVisible = false
          this.$message.success(`${res.message}`)
          this.$emit('ok')
        } else {
          this.$message.error('请填写正确的信息')
        }
      })
    },
    handleClose() {
      this.dialogFormVisible = false
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
