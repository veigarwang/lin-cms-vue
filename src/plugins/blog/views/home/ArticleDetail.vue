<template>
  <div class="content">
    <div class="page-header-index-wide">
      <el-row :gutter="24">
        <el-col :xl="17" :lg="16" :md="24" :sm="24" :xs="24">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span>{{model.title}}</span>
            </div>
            <div class="mavon-editor">
              <mavon-editor
                :toolbarsFlag="false"
                :editable="false"
                :readModel="true"
                defaultOpen="preview"
                :subfield="false"
                v-model="model.content"
                :boxShadow="false"
                previewBackground="#fff"
              />
            </div>
          </el-card>
        </el-col>
        <el-col :xl="7" :lg="8" :md="24" :sm="24" :xs="24">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span>{{model.title}}</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import articleApi from "../../models/article";
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
export default {
  name: "ArticleDetail",
  data() {
    return {
      model: {}
    };
  },
  components: {
    mavonEditor
  },
  computed: {
    id() {
      return this.$route.params.id;
    }
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      this.model = await articleApi.getArticle(this.id);
    }
  }
};
</script>

<style  lang="scss">
.content {
  margin: 24px 24px 0;
}
.page-header-index-wide {
  max-width: 1200px;
  margin: 0 auto;
}
.mavon-editor .v-note-wrapper .v-note-panel {
  border: none;
}
.mavon-editor .v-note-wrapper .v-note-panel .v-note-show .v-show-content {
  background: #fff;
}
</style>