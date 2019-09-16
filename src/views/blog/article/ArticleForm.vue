<template>
  <div class="container">
    <div class="title">{{title}}</div>
    <div class="wrap">
      <el-row>
        <el-col :lg="20" :md="20" :sm="24" :xs="24">
          <el-form :model="form" status-icon ref="form" label-width="100px" @submit.native.prevent>
            <el-row>
              <el-col :lg="12">
                <el-form-item label="标题" prop="title">
                  <el-input size="medium" v-model="form.title" placeholder="请填写标题"></el-input>
                </el-form-item>
              </el-col>
              <el-col :lg="12">
                <el-form-item label="作者" prop="author">
                  <el-input size="medium" v-model="form.author" placeholder="请填写作者"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :lg="12">
                <el-form-item label="关键字" prop="keywords">
                  <el-input size="medium" v-model="form.keywords" placeholder="请填写关键字"></el-input>
                </el-form-item>
              </el-col>
              <el-col :lg="12">
                <el-form-item label="来源" prop="source">
                  <el-input size="medium" v-model="form.source" placeholder="请填写来源"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :lg="12">
                <el-form-item label="封面">
                  <upload-imgs
                    ref="thumbnail"
                    :multiple="false"
                    :value="thumbnailPreview"
                    :min-num="1"
                    :max-num="1"
                  />
                </el-form-item>
              </el-col>
              <el-col :lg="12">
                <el-form-item label="摘要" prop="excerpt">
                  <el-input
                    size="medium"
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 8}"
                    placeholder="请输入摘要"
                    v-model="form.excerpt"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :lg="24">
                <mavon-editor v-model="form.content" />
              </el-col>
            </el-row>
            <el-form-item class="submit">
              <el-button type="primary" @click="submitForm('form')">保 存</el-button>
              <el-button @click="resetForm('form')">重 置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import articleApi from "@/models/article";
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import UploadImgs from "@/components/base/upload-imgs";

export default {
  data() {
    return {
      title: "添加随笔",
      form: {
        archive: "",
        article_type: "",
        comment_quantity: 0,
        content: "",
        editor: 0,
        excerpt: "",
        f_id: 0,
        is_audit: true,
        is_new: true,
        is_stickie: true,
        keywords: "",
        nick_name: null,
        point_quantity: 0,
        recommend: true,
        source: "",
        thumbnail: "",
        title: "",
        type_code: null,
        type_name: null,
        view_hits: 0
      },
      thumbnailPreview: []
    };
  },
  components: {
    mavonEditor,
    UploadImgs
  },
  mounted() {
    this.setForm();
  },
  watch: {
    $route(to, from) {
      this.setForm();
    }
  },
  computed: {
    id() {
      return this.$route.params.id;
    }
  },
  methods: {
    setForm() {
      if (this.id) {
        this.title = "编辑随笔";
        articleApi.getArticle(this.id).then(res => {
          this.form = res;
          this.thumbnailPreview.length = 0;
          this.thumbnailPreview.push({
            id: res.id,
            display: res.thumbnail_display,
            src: res.thumbnail,
            imgId: res.id
          });
        });
      } else {
        this.title = "添加随笔";
        this.resetForm("form");
      }
    },
    async submitForm(formName) {
      try {
        var thumbnail = await this.$refs["thumbnail"].getValue();

        if (thumbnail.length == 0 || thumbnail == false) return;

        this.form.thumbnail = thumbnail[0].src;

        if (this.id == 0) {
          const res = await articleApi.addArticle(this.form);
          if (res.error_code === 0) {
            this.$message.success(`${res.msg}`);
            this.resetForm(formName);
          }
        } else {
          const res = await articleApi.editArticle(this.id, this.form);
          if (res.error_code === 0) {
            this.$message.success(`${res.msg}`);
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.form.content = "";
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
