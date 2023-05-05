<template>
  <div class="container">
    <!-- <div class="lin-info">
      <div class="lin-info-left">
        <div class="welcome">
          <img src="../../assets/image/about/welcome.png" class="welcome-title" alt />
          <div class="subtitle">
            <div class="guide">您还可以点击林间有风官方网站，查看更多作品</div>
            <div class="link">
              <a href="https://www.talelin.com" target="_blank">https://talelin.com</a>
            </div>
          </div>
        </div>
        <img class="welcome-bg" src="../../assets/image/about/header-bg.png" alt />
      </div>
      <div class="lin-info-right">
        <div class="team-detail">
          <div class="team-box">
            <div class="team-title">产品团队</div>
            <ul class="team-ul">
              <li>
                <span class="shadow-box">
                  <i class="team-shadow"></i>
                </span>
                <span class="team-role">策划</span>
                <span class="team-name">七月</span>
              </li>
              <li>
                <span class="shadow-box">
                  <i class="team-shadow"></i>
                </span>
                <span class="team-role">研发</span>
                <span class="team-name">
                  <ul v-if="!showTeam">
                    <li>Pedro</li>
                    <li>一飞</li>
                    <li>凉面</li>
                    <li>圈圈</li>
                    <li>家乐</li>
                    <li>Jocky</li>
                    <li>流乔</li>
                    <li>西麦</li>
                  </ul>
                  <ul v-else>
                    <li>林间有风 CMS 组</li>
                  </ul>
                </span>
              </li>
              <li>
                <span class="shadow-box">
                  <i class="team-shadow"></i>
                </span>
                <span class="team-role">设计</span>
                <span class="team-name">瓜瓜</span>
              </li>
            </ul>
          </div>
          <div class="team-icon">
            <img src="../../assets/image/about/qrcode.jpg" alt />
          </div>
          <p class="team-label">林间有风公众号</p>
        </div>
      </div>
    </div> -->
    <div class="quantity-statistics">
      <div class="quantity-item">
        <div class="quantity-detail">
          <div class="quantity-detail-box">
            <div class="quantity-title">藏书数量</div>
            <div class="quantity-border-line"></div>
            <div class="quantity">{{ bookTotal }}</div>
          </div>
        </div>
        <div class="quantity-icon">
          <img src="../../assets/image/about/icon.png" alt />
        </div>
      </div>
      <div class="quantity-item">
        <div class="quantity-detail">
          <div class="quantity-detail-box">
            <div class="quantity-title">百科词条总数</div>
            <div class="quantity-border-line"></div>
            <div class="quantity">{{ entryTotal }}</div>
          </div>
        </div>
        <div class="quantity-icon">
          <img src="../../assets/image/about/icon.png" alt />
        </div>
      </div>
      <div class="quantity-item">
        <div class="quantity-detail">
          <div class="quantity-detail-box">
            <div class="quantity-title">待定数据1</div>
            <div class="quantity-border-line"></div>
            <div class="quantity">-</div>
          </div>
        </div>
        <div class="quantity-icon">
          <img src="../../assets/image/about/icon.png" alt />
        </div>
      </div>
      <div class="quantity-item">
        <div class="quantity-detail">
          <div class="quantity-detail-box">
            <div class="quantity-title">待定数据2</div>
            <div class="quantity-border-line"></div>
            <div class="quantity">-</div>
          </div>
        </div>
        <div class="quantity-icon">
          <img src="../../assets/image/about/icon.png" alt />
        </div>
      </div>
    </div>
    <div class="information">
      <!-- <div class="personal">
        <div class="personal-title">个人信息</div>
        <img src="../../assets/image/about/avatar.png" class="personal-avatar" />
        <div class="personal-influence">
          <div class="personal-influence-item">
            <div class="personal-influence-num color1">5411</div>
            <div class="personal-influece-label">总访问量</div>
          </div>
          <div class="personal-influence-item">
            <div class="personal-influence-num color2">913</div>
            <div class="personal-influece-label">粉丝</div>
          </div>
          <div class="personal-influence-item">
            <div class="personal-influence-num color3">72</div>
            <div class="personal-influece-label">作品</div>
          </div>
        </div>
        <el-tabs v-model="activeName" class="personal-tabs">
          <el-tab-pane label="最新作品" name="first">
            <div class="content">How to Contribute to Open Source?</div>
          </el-tab-pane>
          <el-tab-pane label="最热作品" name="second">
            <div class="content">为什么程序员们愿意在GitHub上开源...</div>
          </el-tab-pane>
        </el-tabs>
      </div> -->
      <div class="article">
        <div class="article-title">更新历史</div>
        <div class="article-list">
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :type="activity.type"
              :timestamp="activity.timestamp"
              placement="top"
            >
              <el-card>
                <h4>{{ activity.title }}</h4>
                <div style="line-height: 2" v-for="(content, index) in activity.content" :key="index">
                  <el-tag :key="content.label" :type="content.labelType" effect="dark" :color="content.color">{{
                    content.label
                  }}</el-tag>
                  &nbsp;{{ content.entry }}
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
          <!-- <div class="article-item" @click="handleArticle('https://opensource.guide/how-to-contribute/')">
            <img class="article-thumb" src="../../assets/image/about/open-source.jpg" alt />
            <div class="article-detail">
              <p class="article-detail-title">How to Contribute to Open Source?</p>
              <div class="article-detail-content">
                Whether you just made your first open source contribution, or you’re looking for new ways to contribute,
                we hope you’re inspired to take action. Even if your contribution wasn’t accepted, don’t forget to say
                thanks when a maintainer put effort into helping you. Open source is made by people like you: one issue,
                pull request, comment, or high-five at a time.
              </div>
              <div class="article-tool">
                <div class="pubdate">一天前</div>
                <div class="article-about">
                  <span> <i class="iconfont icon-shoucang"></i>37 </span>
                  <el-divider direction="vertical"></el-divider>
                  <span> <i class="iconfont icon-pinglun"></i>2384 </span>
                  <el-divider direction="vertical"></el-divider>
                  <span> <i class="iconfont icon-fenxiang"></i>56 </span>
                </div>
              </div>
            </div>
          </div>
          <div class="article-item" @click="handleArticle('https://www.zhihu.com/question/269033309')">
            <img class="article-thumb" src="../../assets/image/about/open-source.jpg" alt />
            <div class="article-detail article-last">
              <p class="article-detail-title">为什么程序员们愿意在GitHub上开源自己的成果给别人免费使用和学习？</p>
              <div class="article-detail-content">
                “Git的精髓在于让所有人的贡献无缝合并。而GitHub的天才之处，在于理解了Git的精髓。”来一句我们程序员们接地气的话：分享是一种快乐~
              </div>
              <div class="article-tool">
                <div class="pubdate">2019年5月26日</div>
                <div class="article-about">
                  <span> <i class="iconfont icon-shoucang"></i>37 </span>
                  <el-divider direction="vertical"></el-divider>
                  <span> <i class="iconfont icon-pinglun"></i>2384 </span>
                  <el-divider direction="vertical"></el-divider>
                  <span> <i class="iconfont icon-fenxiang"></i>56 </span>
                </div>
              </div>
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import book from '@/model/book'
import encyclopedia from '@/model/encyclopedia'

export default {
  data() {
    return {
      activeName: 'first',
      showTeam: false,
      bookTotal: 0,
      entryTotal: 0,
      activities: [
        {
          title: 'v0.96',
          content: [
            { entry: '书籍管理和山海百科页面增加类别筛选下拉列表', label: '新增', color: 'green' },
            { entry: '查询字典条目列表时会触发一次查询字典类别列表', label: '待修', color: 'red' },
          ],
          timestamp: '2023-03-25 13:35',
          size: 'large',
          type: 'primary',
          //icon: 'el-icon-more',
        },
        {
          title: 'v0.95',
          content: [
            { entry: '词条新增页面增加右上角新增及连续新增按钮', label: '新增', color: 'green' },
            { entry: '调整词条新增页面样式，优化部分提示信息', label: '改善', color: 'blueviolet' },
            { entry: '完善新增词条时对已有词条的判断逻辑', label: '改善', color: 'blueviolet' },
            { entry: '保存词条时自动修正误用的单双引号', label: '改善', color: 'blueviolet' },
          ],
          timestamp: '2023-03-08 23:27',
          //icon: 'el-icon-more',
        },
        {
          title: 'v0.94',
          content: [
            { entry: '增加书籍和百科词条的编辑次数', label: '改善', color: 'blueviolet' },
            { entry: '完善系统日志', label: '改善', color: 'blueviolet' },
            { entry: '修正编辑字典类型后未正常刷新列表的问题', label: '修复', color: 'orange' }
          ],
          timestamp: '2022-06-18 22:50',
          type: '',
        },
        {
          title: 'v0.93',
          content: [
            { entry: '增加更新历史', label: '新增', color: 'green' },
            { entry: '增加显示藏书数量和百科词条总数', label: '新增', color: 'green' },
            { entry: '完善系统日志', label: '改善', color: 'blueviolet' },
          ],
          timestamp: '2022-06-11 09:27',
          type: '',
        },
        {
          title: 'v0.91',
          content: [
            { entry: '增加防止重复出处的判断', label: '改善', color: 'blueviolet' },
            { entry: '完善同名词条自动追加的判断条件', label: '改善', color: 'blueviolet' },
            { entry: '修正编辑词条时读音会被覆盖的问题', label: '修复', color: 'orange' },
          ],
          timestamp: '2022-06-02 23:39',
          type: '',
        },
        {
          title: 'v0.90',
          content: [
            { entry: '增加山海百科模块', label: '新增', color: 'green' },
            { entry: '完善书籍管理模块', label: '改善', color: 'blueviolet' },
            { entry: '优化UI显示', label: '改善', color: 'blueviolet' },
            {
              entry: '修正在非第一页进行表格搜索的情况下，因搜索结果数量不足当前页数而不显示的问题',
              label: '修复',
              color: 'orange',
            },
          ],
          timestamp: '2022-06-01 23:40',
          type: '',
        },
      ],
      items: [
        { type: '', label: '标签一' },
        { type: 'success', label: '标签二' },
        { type: 'info', label: '标签三' },
        { type: 'danger', label: '标签四' },
        { type: 'warning', label: '标签五' },
      ],
    }
  },
  async created() {
    this.bookTotal = await book.getBookTotal()
    this.entryTotal = await encyclopedia.getEncyclopediaTotal()
  },
  mounted() {
    if (document.body.clientWidth > 1200 && document.body.clientWidth < 1330) {
      this.showTeam = true
    }
  },
  methods: {
    handleArticle(link) {
      window.open(link)
    },
  },
}
</script>

<style scoped lang="scss">
.el-card__body > h4 {
  margin-block-start: 0;
  margin-block-end: 0.75em;
}

.el-tag {
  //width: 85px;
  //text-align: center;
  padding: 2px 13px 0 13px;
  border-radius: 4px;
  border: none;
}

.container {
  padding: 20px;
  .lin-info {
    display: flex;
    flex: 1;
    height: 160px;
    width: 100%;
    .lin-info-left {
      position: relative;
      width: 690px;
      height: 100%;
      background: rgba(69, 119, 255, 1);
      box-shadow: 0px 2px 14px 0px rgba(243, 243, 243, 1);
      border-radius: 8px;
      .welcome {
        margin: 28px 0 0 30px;
        .welcome-title {
          width: 366px;
          height: 31px;
        }
        .subtitle {
          display: flex;
          flex-direction: column;
          margin-top: 16px;
          color: #fff;
          .guide {
            margin-right: 20px;
            font-size: 14px;
            font-weight: 400;
            line-height: 20px;
          }
          .link {
            margin-top: 6px;
            width: 160px;
            height: 22px;
            background: rgba(44, 95, 233, 1);
            border-radius: 11px;
            text-align: center;
            line-height: 20px;
            color: rgba(255, 255, 255, 1);
          }
        }
      }
      .welcome-bg {
        position: absolute;
        bottom: 0;
        right: 10px;
        width: 393px;
        height: 121px;
      }
    }
    .lin-info-right {
      flex: 1;
      margin-left: 20px;
      height: 100%;
      display: flex;
      flex-direction: column;
      .team-detail {
        position: relative;
        height: 160px;
        background: rgba(255, 176, 139, 1);
        box-shadow: 0px 2px 14px 0px rgba(243, 243, 243, 1);
        border-radius: 8px;
        .team-box {
          margin: 20px 0 0 22px;
          .team-ul {
            margin-top: 15px;
            li {
              height: 20px;
              line-height: 20px;
              margin-bottom: 15px;
              font-size: 14px;
              .shadow-box {
                position: relative;
                display: inline-block;
                margin-right: 10px;
                width: 14px;
                height: 14px;
                border-radius: 14px;
                background-color: #fff;
                transform: translateY(2px);
                .team-shadow {
                  position: absolute;
                  top: 25%;
                  left: 25%;
                  display: inline-block;
                  width: 6px;
                  height: 6px;
                  border-radius: 6px;
                  background-color: #ffb9a4;
                }
              }
              .team-role {
                display: inline-block;
                width: 30px;
                margin-right: 15px;
                font-weight: 400;
                color: #45526b;
              }
              .team-name {
                font-weight: 400;
                color: #fff;
                ul {
                  display: inline;
                  li {
                    display: inline;
                    margin-right: 15px;
                  }
                }
              }
            }
          }
        }
        .team-icon {
          position: absolute;
          top: 25%;
          right: 33px;
          width: 70px;
          height: 70px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #fff;
          box-shadow: 0 0 10px 0 #cfd5e3;
          img {
            width: 62px;
            height: 62px;
          }
        }
        .team-label {
          position: absolute;
          top: 73%;
          right: 20px;
          font-size: 13px;
          font-weight: 400;
          color: rgba(69, 82, 107, 1);
          line-height: 20px;
        }
      }
    }
  }
  .quantity-statistics {
    display: flex;
    justify-content: space-between;
    //margin-top: 20px;
    height: 90px;
    .quantity-item {
      display: flex;
      width: 24%;
      height: 100%;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 2px 14px 0px rgba(243, 243, 243, 1);
      border-radius: 8px;
      .quantity-detail {
        flex: 1;
        .quantity-detail-box {
          margin: 12px 0 0 30px;
          .quantity-title {
            margin-bottom: 2px;
            height: 20px;
            line-height: 20px;
            color: #495468;
            font-size: 14px;
            font-weight: 400;
          }
          .quantity-border-line {
            width: 96px;
            height: 2px;
            background: rgba(73, 84, 104, 1);
          }
          .quantity {
            margin-top: 7px;
            height: 48px;
            font-size: 32px;
            color: rgba(73, 84, 104, 1);
            line-height: 38px;
            letter-spacing: 2px;
          }
        }
      }
      .quantity-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 90px;
        height: 100%;
        background: rgba(69, 119, 255, 0.1);
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
        img {
          width: 28px;
          height: 33px;
        }
      }
    }
  }
  .information {
    margin-top: 20px;
    display: flex;
    .personal {
      width: 320px;
      height: 100%;
      margin-right: 20px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 2px 14px 0px rgba(243, 243, 243, 1);
      border-radius: 8px;
      .personal-title {
        margin: 20px 0 10px 20px;
        height: 22px;
        line-height: 22px;
        font-weight: 500;
        color: #596c8e;
        font-size: 16px;
      }
      .personal-avatar {
        width: 140px;
        height: 140px;
        margin: 0 auto 40px;
        border-radius: 75px;
        box-shadow: 0 0 30px 0 #cfd5e3;
      }
      .personal-influence {
        display: flex;
        justify-content: space-between;
        padding: 0 30px 40px;
        .personal-influence-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          .personal-influence-num {
            font-size: 28px;
            line-height: 34px;
            &.color1 {
              color: #00c292;
            }
            &.color2 {
              color: #fec108;
            }
            &.color3 {
              color: #03a9f3;
            }
          }
          .personal-influece-label {
            font-size: 12px;
            font-weight: 400;
            color: #8c98ae;
            line-height: 17px;
          }
        }
      }
      .personal-tabs {
        margin-bottom: 20px;
      }
      .personal-tabs /deep/ .is-top {
        width: 320px;
        display: flex;
        justify-content: space-around;
      }
      .personal-tabs /deep/ .el-tabs__content {
        text-indent: 20px;
      }
    }
    .article {
      flex: 1;
      height: 100%;
      padding: 20px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 2px 14px 0px rgba(243, 243, 243, 1);
      border-radius: 8px;
      .article-title {
        height: 22px;
        line-height: 22px;
        font-weight: 500;
        color: #596c8e;
        font-size: 16px;
        margin-bottom: 20px;
      }
      .article-list {
        //cursor: pointer;
        .el-tag + .el-tag {
          margin-left: 10px;
        }
        .article-item {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          .article-thumb {
            width: 120px;
            height: 120px;
            border-radius: 8px;
            margin-right: 30px;
          }
          .article-detail {
            flex: 1;
            border-bottom: 1px #ecedef solid;
            margin-bottom: 20px;
            &.article-last {
              border-bottom: none;
              margin-bottom: 0;
            }
            .article-detail-title {
              height: 22px;
              font-size: 16px;
              font-weight: 400;
              color: rgba(69, 82, 107, 1);
              line-height: 22px;
            }
            .article-detail-content {
              margin-top: 10px;
              font-size: 14px;
              font-weight: 400;
              color: rgba(140, 152, 174, 1);
              line-height: 22px;
            }
          }
          .article-tool {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            margin: 10px 0 20px 0;
            font-size: 12px;
            line-height: 17px;
            font-weight: 400;
            color: #808da3;
            .article-about {
              .iconfont {
                line-height: 17px;
                margin-right: 6px;
                font-size: 12px;
              }
            }
          }
        }
      }
    }
  }
}
@media screen and (max-width: 1200px) {
  .container .lin-info .lin-info-right {
    display: none;
  }
  .container .lin-info .lin-info-left {
    width: 100%;
  }
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