<template>
  <div class="container">
    <article-list></article-list>
    <!-- <infinite-loading @infinite="infiniteHandler"></infinite-loading> -->
  </div>
</template>

<script>
import ArticleList from "./ArticleList";
import InfiniteLoading from "vue-infinite-loading";

export default {
  name: "HomeIndex",
  components: { ArticleList, InfiniteLoading },
  data() {
    return { count: 20 };
  },
  mounted() {},
  computed: {},
  methods: {
    infiniteHandler($state) {
      console.log(this.count);
      setTimeout(() => {
        $state.loaded();
        this.count += 10;
      }, 2000);
    }
  }
};
</script>

<style scoped lang="scss">
.container {
  padding: 20px;
}
</style>
