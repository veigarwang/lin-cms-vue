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
        <el-form-item label="昵称" prop="au_name">
          <el-input size="medium" v-model="form.au_name"></el-input>
        </el-form-item>
        <el-form-item label="邮件" prop="au_email">
          <el-input size="medium" v-model="form.au_email"></el-input>
        </el-form-item>
        <el-form-item label="评论内容" prop="text">
          <el-input size="medium" v-model="form.text"></el-input>
        </el-form-item>
        <el-form-item label="ip" prop="ip">
          <el-input size="medium" v-model="form.ip"></el-input>
        </el-form-item>
        <el-form-item label="User-Agent" prop="agent">
          <el-input size="medium" v-model="form.agent"></el-input>
        </el-form-item>
        <el-form-item label="系统" prop="system">
          <el-input size="medium" v-model="form.system"></el-input>
        </el-form-item>
        <el-form-item label="主机名" prop="user_host">
          <el-input size="medium" v-model="form.user_host"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="is_audited">
          <el-radio v-model="form.is_audited" label="true">审核通过</el-radio>
          <el-radio v-model="form.is_audited" label="false">拉黑</el-radio>
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
import commentApi from "@/models/comment";

export default {
  name: "CommentDialog",
  data() {
    return {
      id: 0, // id
      dialogFormVisible: false, // 控制弹窗显示
      loading: false,
      form: {
        agent: "",
        article_id: 0,
        au_email: "",
        au_name: "",
        avatar: "",
        geo_position: "",
        ip: ":",
        is_audited: true,
        p_id: 0,
        p_name: "",
        system: "",
        text: "",
        user_host: ""
      }
    };
  },
  methods: {
    show(record) {
      Object.assign(this.form, record);
      this.dialogFormVisible = true;
    },
    handleClose() {
      this.dialogFormVisible = false;
    }
  }
};
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
