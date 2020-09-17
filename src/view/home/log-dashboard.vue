<template>
  <div class="container">
    <div class="quantity-statistics">
      <div class="quantity-item">
        <div class="quantity-detail">
          <div class="quantity-detail-box">
            <div class="quantity-title">所有日志</div>
            <div class="quantity-border-line"></div>
            <div class="quantity">{{res.all_count}}</div>
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
            <div class="quantity">{{res.unique_count}}</div>
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
            <div class="quantity">{{res.today_count}}</div>
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
            <div class="quantity">{{res.hour_count}}</div>
          </div>
        </div>
        <div class="quantity-icon">
          <l-icon name="question" color="blue"></l-icon>
        </div>
      </div>
    </div>
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="grid-content bg-purple">
          <div id="line"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import log from 'lin/model/log'
import { Line } from '@antv/g2plot'

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
    this.getLine()
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
    },
    getLine() {
      const data = [
        {
          date: '2018/8/1',
          type: 'download',
          value: 4623,
        },
        {
          date: '2018/8/1',
          type: 'register',
          value: 2208,
        },
        {
          date: '2018/8/1',
          type: 'bill',
          value: 182,
        },
        {
          date: '2018/8/2',
          type: 'download',
          value: 6145,
        },
        {
          date: '2018/8/2',
          type: 'register',
          value: 2016,
        },
        {
          date: '2018/8/2',
          type: 'bill',
          value: 257,
        },
        {
          date: '2018/8/3',
          type: 'download',
          value: 508,
        },
        {
          date: '2018/8/3',
          type: 'register',
          value: 2916,
        },
        {
          date: '2018/8/3',
          type: 'bill',
          value: 289,
        },
        {
          date: '2018/8/4',
          type: 'download',
          value: 6268,
        },
        {
          date: '2018/8/4',
          type: 'register',
          value: 4512,
        },
        {
          date: '2018/8/4',
          type: 'bill',
          value: 428,
        },
        {
          date: '2018/8/5',
          type: 'download',
          value: 6411,
        },
        {
          date: '2018/8/5',
          type: 'register',
          value: 8281,
        },
        {
          date: '2018/8/5',
          type: 'bill',
          value: 619,
        },
        {
          date: '2018/8/6',
          type: 'download',
          value: 1890,
        },
        {
          date: '2018/8/6',
          type: 'register',
          value: 2008,
        },
        {
          date: '2018/8/6',
          type: 'bill',
          value: 87,
        },
        {
          date: '2018/8/7',
          type: 'download',
          value: 4251,
        },
        {
          date: '2018/8/7',
          type: 'register',
          value: 1963,
        },
        {
          date: '2018/8/7',
          type: 'bill',
          value: 706,
        },
        {
          date: '2018/8/8',
          type: 'download',
          value: 2978,
        },
        {
          date: '2018/8/8',
          type: 'register',
          value: 2367,
        },
        {
          date: '2018/8/8',
          type: 'bill',
          value: 387,
        },
        {
          date: '2018/8/9',
          type: 'download',
          value: 3880,
        },
        {
          date: '2018/8/9',
          type: 'register',
          value: 2956,
        },
        {
          date: '2018/8/9',
          type: 'bill',
          value: 488,
        },
        {
          date: '2018/8/10',
          type: 'download',
          value: 3606,
        },
        {
          date: '2018/8/10',
          type: 'register',
          value: 678,
        },
        {
          date: '2018/8/10',
          type: 'bill',
          value: 507,
        },
        {
          date: '2018/8/11',
          type: 'download',
          value: 4311,
        },
        {
          date: '2018/8/11',
          type: 'register',
          value: 3188,
        },
        {
          date: '2018/8/11',
          type: 'bill',
          value: 548,
        },
        {
          date: '2018/8/12',
          type: 'download',
          value: 4116,
        },
        {
          date: '2018/8/12',
          type: 'register',
          value: 3491,
        },
        {
          date: '2018/8/12',
          type: 'bill',
          value: 456,
        },
        {
          date: '2018/8/13',
          type: 'download',
          value: 6419,
        },
        {
          date: '2018/8/13',
          type: 'register',
          value: 2852,
        },
        {
          date: '2018/8/13',
          type: 'bill',
          value: 689,
        },
        {
          date: '2018/8/14',
          type: 'download',
          value: 1643,
        },
        {
          date: '2018/8/14',
          type: 'register',
          value: 4788,
        },
        {
          date: '2018/8/14',
          type: 'bill',
          value: 280,
        },
        {
          date: '2018/8/15',
          type: 'download',
          value: 445,
        },
        {
          date: '2018/8/15',
          type: 'register',
          value: 4319,
        },
        {
          date: '2018/8/15',
          type: 'bill',
          value: 176,
        },
      ]

      const linePlot = new Line(document.getElementById('line'), {
        title: {
          visible: true,
          text: '日志分析图',
        },
        description: {
          visible: true,
          text: '根据日志出现的级别区分数据',
        },
        padding: 'auto',
        forceFit: true,
        data,
        xField: 'date',
        yField: 'value',
        yAxis: {
          label: {
            // 数值格式化为千分位
            formatter: v => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, s => `${s},`),
          },
        },
        legend: {
          position: 'right-top',
        },
        seriesField: 'type',
        responsive: true,
      })

      linePlot.render()
    },
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