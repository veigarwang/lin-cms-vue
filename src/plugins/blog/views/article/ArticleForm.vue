<template>
  <div class="container">
    <div class="title">{{title}}</div>
    <div class="wrap">
      <el-row>
        <el-col :lg="24" :md="24" :sm="24" :xs="24">
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
              <el-col :lg="6">
                <el-form-item label="分类专栏" prop="classify_id">
                  <el-select
                    size="medium"
                    filterable
                    v-model="form.classify_id"
                    :disabled="types.length === 0"
                    placeholder="请选择分类专栏"
                  >
                    <el-option
                      v-for="item in types"
                      :key="item.id"
                      :label="item.item_name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="6">
                <el-form-item label="随笔类型" prop="excerpt">
                  <el-select
                    v-model="form.article_type"
                    filterable
                    default-first-option
                    placeholder="请选择随笔类型"
                  >
                    <el-option
                      v-for="item in article_types"
                      :key="Number(item.item_code)"
                      :label="item.item_name"
                      :value="Number(item.item_code)"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="12">
                <el-form-item label="标签" prop="source">
                  <el-select
                    style="width:100%;"
                    v-model="form.tag_ids"
                    multiple
                    filterable
                    default-first-option
                    placeholder="请选择标签"
                  >
                    <el-option
                      v-for="item in tags"
                      :key="item.id"
                      :label="item.item_name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
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
import baseApi from "@/plugins/Base/models/base";
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import UploadImgs from "@/components/base/upload-imgs";
import articleApi from "../../models/article";

export default {
  name: "ArticleForm",
  data() {
    return {
      title: "添加随笔",
      form: {
        archive: "",
        comment_quantity: 0,
        content: "",
        editor: 0,
        excerpt: "",
        classify_id: 0,
        is_audit: true,
        is_new: true,
        is_stickie: true,
        author: "",
        keywords: "",
        nick_name: null,
        point_quantity: 0,
        recommend: true,
        source: "",
        thumbnail: "",
        title: "",
        type_code: null,
        type_name: null,
        view_hits: 0,
        article_type: 0
      },
      thumbnailPreview: [],
      types: [],
      tags: [],
      article_types: []
    };
  },
  components: {
    mavonEditor,
    UploadImgs
  },
  mounted() {
    this.setForm();
  },
  async created() {
    this.types = await baseApi.getItems({
      typeCode: "Article.Classify"
    });
    this.tags = await baseApi.getItems({
      typeCode: "Article.Tag"
    });
    this.article_types = await baseApi.getItems({
      typeCode: "Article.Type"
    });
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
          if (res.thumbnail) {
            this.thumbnailPreview.push({
              id: res.id,
              display: res.thumbnail_display,
              src: res.thumbnail,
              imgId: res.id
            });
          }
        });
      } else {
        this.title = "添加随笔";
        this.resetForm("form");
      }
    },
    async submitForm(formName) {
      try {
        var thumbnail = await this.$refs["thumbnail"].getValue();
        if (thumbnail.length > 0) {
          this.form.thumbnail = thumbnail[0].src;
        } else {
          this.form.thumbnail = "";
        }

        if (this.id) {
          const res = await articleApi.editArticle(this.id, this.form);
          if (res.error_code === 0) {
            this.$message.success(`${res.msg}`);
          }
        } else {
          const res = await articleApi.addArticle(this.form);
          if (res.error_code === 0) {
            this.$message.success(`${res.msg}`);
            this.resetForm(formName);
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.form.content = "";
      this.form.id = 0;
      this.$refs["thumbnail"].clear();
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
