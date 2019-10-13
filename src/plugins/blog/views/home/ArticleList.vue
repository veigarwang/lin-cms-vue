<template>
  <div class="article">
    <div class="article-list">
      <div class="article-item">
        <img class="article-thumb" :src="data.thumbnail_display" alt />
        <div class="article-detail">
          <div class="info-row">
            <ul class="meta-list">
              <li class="item username clickable">
                <a :href="'/blog/detail/'+data.id">{{data.author}}</a>
              </li>
              <li class="item">{{data.time_span}}</li>
              <!-- <li class="item" v-for="(tag,index) in data.tags" v-bind:key="index">
                <a class="tag">{{tag}}</a>
              </li>-->
            </ul>
          </div>
          <div class="info-row title-row">
            <p class="article-detail-title" @click="toArticle">{{data.title}}</p>
          </div>
          <div class="info-row article-detail-content">{{data.excerpt}}</div>
          <div class="info-row">
            <div class="article-tool">
              <ul class="article-about">
                <li>
                  <a href>
                    <i class="iconfont icon-shoucang"></i>
                    {{data.point_quantity}}
                  </a>
                </li>
                <li>
                  <a href>
                    <i class="iconfont icon-pinglun"></i>
                    {{data.comment_quantity}}
                  </a>
                </li>
                <li>
                  <a href>
                    <i class="iconfont icon-fenxiang"></i>
                    {{data.view_hits}}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ArticleList",
  data() {
    return {};
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          classify_id: 7,
          classify_name: null,
          time_span: "1周前",
          is_new: false,
          title: "学习spring-boot",
          keywords: "spring-boot",
          source: "",
          excerpt:
            "## springboot \n\n- annotation注解\n\n1. @RestController=@Controller+@ResponseBody是在RESTful Web服务中，基于sprinboot 2.0首选方法。",
          view_hits: 0,
          comment_quantity: 0,
          point_quantity: 0,
          thumbnail: "2019/10/03/8e7da70d-def1-4b5f-a927-c8f5419ffed0.jpeg",
          thumbnail_display:
            "https://localhost:5001/assets/2019/10/03/8e7da70d-def1-4b5f-a927-c8f5419ffed0.jpeg",
          is_audit: true,
          recommend: true,
          is_stickie: true,
          archive: "2019年10月",
          article_type: 0,
          editor: 0,
          create_user_id: 7,
          create_time: 1570080313087.0,
          author: "admin",
          tag_ids: [2, 3, 1],
          id: 3
        };
      }
    }
  },
  mounted() {},
  methods: {
    toArticle() {
      this.$router.push({ path: "/post/" + this.data.id });
    }
  }
};
</script>

<style scoped lang="scss">
.article {
  flex: 1;
  padding: 20px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 14px 0px rgba(243, 243, 243, 1);
  border-radius: 8px;
  .article-list {
    // cursor: pointer;
    .article-item {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;

      .article-thumb {
        cursor: pointer;
        width: 120px;
        height: 120px;
        border-radius: 8px;
        margin-right: 30px;
      }
      .article-detail {
        flex: 1;

        .article-detail-title {
          cursor: pointer;
          height: 22px;
          font-size: 18px;
          font-weight: 600;
          color: rgba(69, 82, 107, 1);
          line-height: 22px;
        }
        .article-detail-title:hover {
          text-decoration: underline;
        }
        .article-detail-content {
          margin-bottom: 10px;
          font-size: 14px;
          font-weight: 400;
          color: rgba(140, 152, 174, 1);
          line-height: 22px;
        }
      }
      .title-row {
        margin: 0.5rem 0 1rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .info-row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        font-size: 12px;
        line-height: 17px;
        color: #808da3;
        .meta-list {
          display: flex;
          align-items: baseline;
          white-space: nowrap;
          .item.clickable:hover {
            color: #007fff;
          }
          .item.username {
            display: flex;
            align-items: baseline;
          }
          .item:not(:last-child)::after {
            content: "·";
            color: rgb(178, 186, 194);
            margin: 0px 0.4em;
          }
          .item a.tag:not(:last-child):after {
            content: "/";
            margin: 0 0.2em;
            color: #b2bac2;
          }
          .item .tag:hover {
            color: #007fff;
          }
        }

        .article-tool {
          ul.article-about {
            display: inline-flex;
            white-space: nowrap;
            li {
              height: 1.8rem;
              font-size: 1.083rem;
              line-height: 1;
              white-space: nowrap;
              color: #b2bac2;
              border-radius: 1px;
              border: 1px solid #edeeef;
              cursor: pointer;
              a {
                display: flex;
                align-items: center;
                padding: 0 0.8rem;
                height: 100%;
                color: inherit;
              }
            }
            li:hover {
              background-color: #f7f8fa;
            }
            .iconfont {
              margin-right: 0.2em;
            }
          }
        }
      }
    }
  }
}
@media (max-width: 600px) {
  .article-thumb {
    display: none;
  }
}

@media screen and (max-width: 1200px) {
  .container .quantity-statistics .quantity-item {
    width: 32%;
    &:last-child {
      display: none;
    }
  }
  .container .information .personal {
    display: none;
  }
}

@media screen and (max-width: 1200px) {
  .container .lin-info .lin-info-left {
    width: 100%;
  }
}
</style>
