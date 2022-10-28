<template>
  <div class="article">
    <div class="article-list">
      <div class="article-item">
        <img class="article-thumb" src="@/assets/image/about/open-source.jpg" alt />
        <div class="article-detail">
          <div class="info-row">
            <ul class="meta-list">
              <li class="item username clickable">
                <a href>tinycoder</a>
              </li>
              <li class="item">一天前</li>
              <li class="item">
                <a class="tag">ECMAScript 6</a>
                <a class="tag">JavaScript</a>
              </li>
            </ul>
          </div>
          <div class="info-row title-row">
            <p class="article-detail-title">How to Contribute to Open Source?</p>
          </div>
          <div class="info-row article-detail-content">
            Whether you just made your first open source contribution, or you’re looking for new ways to contribute, we
            hope you’re inspired to take action.
            Even if your contribution wasn’t accepted, don’t forget to say thanks when a maintainer put effort into
            helping you.
            Open source is made by people like you: one issue, pull request, comment, or high-five at a time.
          </div>
          <div class="info-row">
            <div class="article-tool">
              <ul class="article-about">
                <li>
                  <a href>
                    <i class="iconfont icon-shoucang"></i>37
                  </a>
                </li>
                <li>
                  <a href>
                    <i class="iconfont icon-pinglun"></i>2384
                  </a>
                </li>
                <li>
                  <a href>
                    <i class="iconfont icon-fenxiang"></i>
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
  name: 'ArticleList',
  data() {
    return {}
  },
  props: {
    data: {
      type: Object,
      default: {},
    },
  },
  mounted() { },
  methods: {},
}
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
            content: '·';
            color: rgb(178, 186, 194);
            margin: 0px 0.4em;
          }

          .item a.tag:not(:last-child):after {
            content: '/';
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
