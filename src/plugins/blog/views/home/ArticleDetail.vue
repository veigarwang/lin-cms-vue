<template>
  <div>{{id}}</div>
</template>

<script>
export default {
  name: "Post",
  computed: {
    id() {
      return this.$route.params.id;
    }
  },
  created() {
    var id = this.$route.params.id;
  }
};
</script>

<style>
</style>