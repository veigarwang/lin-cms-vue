<template>
  <div class="container">
    <div class="quantity-statistics">
      <div class="quantity-item">
        <div class="quantity-detail">
          <div class="quantity-detail-box">
            <div class="quantity-title">所有日志</div>
            <div class="quantity-border-line"></div>
            <div class="quantity">{{ res.all_count }}</div>
          </div>
        </div>
        <div class="quantity-icon">
          <l-icon name="signal-fill" color="blue"></l-icon>
        </div>
      </div>
      <div class="quantity-item">
        <div class="quantity-detail">
          <div class="quantity-detail-box">
            <div class="quantity-title">不重复日志</div>
            <div class="quantity-border-line"></div>
            <div class="quantity">{{ res.unique_count }}</div>
          </div>
        </div>
        <div class="quantity-icon">
          <l-icon name="pic-left" color="blue"></l-icon>
        </div>
      </div>
      <div class="quantity-item">
        <div class="quantity-detail">
          <div class="quantity-detail-box">
            <div class="quantity-title">今天的日志 (月)</div>
            <div class="quantity-border-line"></div>
            <div class="quantity">{{ res.today_count }}</div>
          </div>
        </div>
        <div class="quantity-icon">
          <l-icon name="zoomin" color="blue"></l-icon>
        </div>
      </div>
      <div class="quantity-item">
        <div class="quantity-detail">
          <div class="quantity-detail-box">
            <div class="quantity-title">一小时之内</div>
            <div class="quantity-border-line"></div>
            <div class="quantity">{{ res.hour_count }}</div>
          </div>
        </div>
        <div class="quantity-icon">
          <l-icon name="question" color="blue"></l-icon>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import log from 'lin/model/log'

export default {
  data() {
    return {
      activeName: 'first',
      showTeam: false,
      res: { today_count: 0, hour_count: 0, all_count: 0, unique_count: 0 },
    }
  },
  async created() {
    await this.getLogDashboard()
  },
  mounted() {
    if (document.body.clientWidth > 1200 && document.body.clientWidth < 1330) {
      this.showTeam = true
    }
  },
  methods: {
    async getLogDashboard() {
      const res = await log.getLogDashboard()
      this.res = res
    }
  },
}
</script>

<style scoped lang="scss">
.container {
  padding: 20px;

  .quantity-statistics {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    height: 90px;

    .quantity-item {
      display: flex;
      width: 23%;
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
            width: 46px;
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
