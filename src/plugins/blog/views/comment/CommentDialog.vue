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
        <el-form-item label="用户" prop="au_email">
          <el-input size="medium" v-model="form.au_email" readonly></el-input>
        </el-form-item>
        <el-form-item label="评论内容" prop="text">
          <el-input size="medium" v-model="form.text" readonly></el-input>
        </el-form-item>

        <el-form-item label="状态" prop="is_audited">
          <el-radio v-model="form.is_audited" :label="true">审核通过</el-radio>
          <el-radio v-model="form.is_audited" :label="false">拉黑</el-radio>
          <!-- <el-input size="medium" v-model="form.is_audited"></el-input> -->
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer" style="padding-left:5px;">
      <el-button type="primary" @click="handleClose">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'CommentDialog',
  data() {
    return {
      id: 0, // id
      dialogFormVisible: false, // 控制弹窗显示
      loading: false,
      form: {
        avatar: '',
        is_audited: true,
        text: '',
      },
    }
  },
  methods: {
    show(record) {
      Object.assign(this.form, record)
      this.dialogFormVisible = true
    },
    handleClose() {
      this.dialogFormVisible = false
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
    text-indent: 40px;
    border-bottom: 1px solid #dae1ec;
  }

  .wrap {
    padding: 20px;
  }

  .submit {
    float: left;
  }
}
</style>
