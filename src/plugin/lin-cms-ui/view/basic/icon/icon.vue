<template>
  <div class="lin-container">
    <div class="lin-title">Icon 图标</div>
    <div class="lin-wrap-ui">
      <el-card style="margin-bottom: 50px">
        <div slot="header"><span>方向性图标</span></div>
        <el-row style="margin-bottom: 10px">
          <el-col :span="4" v-for="item in iconList1" :key="item" style="margin-bottom: 20px; text-align: center">
            <l-icon :name="item" :color="color" :width="width" :height="height"></l-icon>
            <div style="color: #2f4e8c; margin-top: 5px">{{ item }}</div>
          </el-col>
        </el-row>
      </el-card>

      <el-card style="margin-bottom: 50px">
        <div slot="header"><span>提示建议性图标</span></div>
        <el-row style="margin-bottom: 10px">
          <el-col :span="4" v-for="item in iconList2" :key="item" style="margin-bottom: 20px; text-align: center">
            <l-icon :name="item" :color="color" :width="width" :height="height"></l-icon>
            <div style="color: #2f4e8c; margin-top: 5px">{{ item }}</div>
          </el-col>
        </el-row>
      </el-card>

      <el-card style="margin-bottom: 50px">
        <div slot="header"><span>编辑类图标</span></div>
        <el-row style="margin-bottom: 10px">
          <el-col :span="4" v-for="item in iconList3" :key="item" style="margin-bottom: 20px; text-align: center">
            <l-icon :name="item" :color="color" :width="width" :height="height"></l-icon>
            <div style="color: #2f4e8c; margin-top: 5px">{{ item }}</div>
          </el-col>
        </el-row>
      </el-card>

      <el-card style="margin-bottom: 50px">
        <div slot="header"><span>网站通用图标</span></div>
        <el-row style="margin-bottom: 10px">
          <el-col :span="4" v-for="item in iconList4" :key="item" style="margin-bottom: 20px; text-align: center">
            <l-icon :name="item" :color="color" :width="width" :height="height"></l-icon>
            <div style="color: #2f4e8c; margin-top: 5px">{{ item }}</div>
          </el-col>
        </el-row>
      </el-card>

      <el-card style="margin-bottom: 50px">
        <div slot="header"><span>icon.scss 全部图标</span></div>
        <el-row style="margin-bottom: 10px">
          <el-col :span="4" v-for="item in iconList5" :key="item" style="margin-bottom: 20px; text-align: center">
            <i :class="'el-icon-' + item" style="color: #2f4e8c; font-size: 2rem; margin: 20px"></i><br />{{ item }}
          </el-col>
        </el-row>
      </el-card>

      <el-card style="margin-bottom: 50px">
        <div slot="header"><span>iconfont.css 全部图标</span></div>
        <el-row style="margin-bottom: 10px">
          <el-col :span="4" v-for="item in iconList6" :key="item" style="margin: 20px; text-align: center">
            <i :class="'iconfont ' + item" style="color: #2f4e8c; font-size: 2rem;"></i><br />{{ item }}
          </el-col>
        </el-row>
      </el-card>
    </div>
    <source-code
      :link="`https://github.com/TaleLin/lin-cms-vue/blob/8b4ef5bdc81d3f567ccc7785d61b962ad21c69cf/src/plugin/lin-cms-ui/view/basic/icon/icon.vue`"
    ></source-code>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  data() {
    return {
      color: '#3963bc',
      width: '30px',
      height: '30px',
      iconList1: [
        'step-backward',
        'step-forward',
        'fast-backward',
        'fast-forward',
        'shrink',
        'arrawsalt',
        'down',
        'up',
        'left',
        'right',
        'caret-up',
        'caret-down',
        'caret-left',
        'caret-right',
        'up-circle',
        'down-circle',
        'left-circle',
        'right-circle',
      ],
      iconList2: [
        'question',
        'question-circle',
        'plus',
        'plus-circle',
        'minus',
        'minus-circle',
        'plus-square',
        'minus-square',
        'info-circle',
        'close',
        'close-circle',
        'close-square',
      ],
      iconList3: [
        'edit',
        'ellipsis',
        'file',
        'file-text',
        'file-unknown',
        'file-pdf',
        'file-word',
        'file-excel',
        'file-ppt',
        'file-markdown',
        'file-add',
        'folder',
        'folder-open',
        'folder-add',
        'frown',
        'meh',
        'smile',
      ],
      iconList4: [
        'shake',
        'api',
        'fork',
        'dashboard',
        'table',
        'android',
        'apple',
        'windows',
        'chrome',
        'aliwangwang',
        'weibo',
        'twitter',
        'taobao',
        'skype',
        'medium',
        'linkedin',
        'dropbox',
        'facebook',
        'codepen',
        'amazon',
        'google',
        'alipay',
        'zhihu',
        'slack',
        'behance',
      ],
      iconList5: [
        'ice-cream-round',

        'ice-cream-square',

        'lollipop',

        'potato-strips',

        'milk-tea',

        'ice-drink',

        'ice-tea',
        'coffee',

        'orange',
        'pear',

        'apple',

        'cherry',

        'watermelon',

        'grape',
        'refrigerator',

        'goblet-square-full',
        'goblet-square',
        'goblet-full',
        'goblet',

        'cold-drink',

        'coffee-cup',

        'water-cup',

        'hot-water',

        'ice-cream',

        'dessert',

        'sugar',

        'tableware',

        'burger',

        'knife-fork',

        'fork-spoon',

        'chicken',

        'food',
        'dish-1',

        'dish',

        'moon-night',

        'moon',

        'cloudy-and-sunny',
        'partly-cloudy',

        'cloudy',

        'sunny',

        'sunset',

        'sunrise-1',

        'sunrise',

        'heavy-rain',

        'lightning',

        'light-rain',

        'wind-power',

        'baseball',

        'soccer',

        'football',

        'basketball',

        'ship',

        'truck',

        'bicycle',

        'mobile-phone',

        'service',

        'key',

        'unlock',

        'lock',

        'watch',

        'watch-1',

        'timer',

        'alarm-clock',
        'map-location',

        'delete-location',

        'add-location',
        'location-information',

        'location-outline',

        'location',
        'place',

        'discover',

        'first-aid-kit',

        'trophy-1',

        'trophy',
        'medal',

        'medal-1',

        'stopwatch',

        'mic',

        'copy-document',

        'full-screen',

        'switch-button',

        'aim',

        'crop',

        'odometer',

        'time',

        'bangzhu',

        'close-notification',

        'microphone',

        'turn-off-microphone',

        'position',

        'postcard',

        'message',

        'chat-line-square',

        'chat-dot-square',

        'chat-dot-round',

        'chat-square',
        'chat-line-round',

        'chat-round',

        'set-up',

        'turn-off',

        'open',

        'connection',

        'link',

        'cpu',

        'thumb',

        'female',
        'male',
        'guide',

        'news',
        'price-tag',
        'discount',

        'wallet',
        'coin',

        'money',

        'bank-card',
        'box',

        'present',

        'sell',
        'sold-out',

        'shopping-bag-2',
        'shopping-bag-1',

        'shopping-cart-2',

        'shopping-cart-1',

        'shopping-cart-full',

        'smoking',
        'no-smoking',

        'house',
        'table-lamp',

        'school',

        'office-building',

        'toilet-paper',

        'notebook-2',
        'notebook-1',
        'files',

        'collection',

        'receiving',

        'suitcase-1',

        'suitcase',

        'film',

        'collection-tag',

        'data-analysis',

        'pie-chart',
        'data-board',

        'data-line',

        'reading',

        'magic-stick',
        'coordinate',

        'mouse',

        'brush',

        'headset',

        'umbrella',
        'scissors',

        'mobile',

        'attract',

        'monitor',

        'search',

        'takeaway-box',

        'paperclip',

        'printer',

        'document-add',

        'document',

        'document-checked',

        'document-copy',

        'document-delete',
        'document-remove',
        'tickets',

        'folder-checked',

        'folder-delete',
        'folder-remove',

        'folder-add',

        'folder-opened',
        'folder',

        'edit-outline',

        'edit',

        'date',
        'c-scale-to-original',
        'view',

        'loading',

        'rank',
        'sort-down',

        'sort-up',

        'sort',

        'finished',

        'refresh-left',

        'refresh-right',

        'refresh',

        'video-play',

        'video-pause',

        'd-arrow-right',
        'd-arrow-left',

        'arrow-up',
        'arrow-down',

        'arrow-right',

        'arrow-left',
        'top-right',

        'top-left',

        'top',

        'bottom',

        'right',

        'back',

        'bottom-right',
        'bottom-left',

        'caret-top',
        'caret-bottom',

        'caret-right',

        'caret-left',

        'd-caret',
        'share',

        'menu',

        's-grid',

        's-check',

        's-data',

        's-opportunity',

        's-custom',
        's-claim',

        's-finance',

        's-comment',
        's-flag',
        's-marketing',

        's-shop',

        's-open',

        's-management',

        's-ticket',

        's-release',

        's-home',

        's-promotion',
        's-operation',

        's-unfold',

        's-fold',
        's-platform',
        's-order',

        's-cooperation',

        'bell',

        'message-solid',

        'video-camera',

        'video-camera-solid',

        'camera',

        'camera-solid',

        'download',
        'upload2',

        'upload',

        'picture-outline-round',

        'picture-outline',

        'picture',

        'close',

        'check',

        'plus',
        'minus',

        'help',
        's-help',

        'circle-close',
        'circle-check',

        'circle-plus-outline',

        'remove-outline',

        'zoom-out',

        'zoom-in',

        'error',
        'success',

        'circle-plus',
        'remove',
        'info',

        'question',
        'warning-outline',

        'warning',

        'goods',

        's-goods',
        'star-off',

        'star-on',

        'more-outline',

        'more',

        'phone-outline',

        'phone',

        'user',
        'user-solid',
        'setting',
        's-tools',
        'delete',
        'delete-solid',
        'eleme',
        'platform-eleme',
      ],
      iconList6: [
        'icon-jiantou',

        'icon-weibiaoti--',

        'icon-moshubang',

        'icon-icon-yijianguanbi',

        'icon-zidingyi',

        'icon-jia',

        'icon-jian1',

        'icon-pinglun',

        'icon-fenxiang',

        'icon-shoucang',

        'icon-icon-test',

        'icon-quxiaoquanping',

        'icon-quanping',

        'icon-xsaaa',

        'icon-daima1',

        'icon-jiemiansheji',

        'icon-jiemianicon-',

        'icon-pifu',

        'icon-chajian',

        'icon-tubiao',

        'icon-tushuguanli',

        'icon-shili',

        'icon-erjizhibiao',
        'icon-erjituandui',

        'icon-erji1',

        'icon-erji',

        'icon-table1',

        'icon-huiyuan',

        'icon-clock',

        'icon-xiangyoujiantou',

        'icon-huiyuan1',
        'icon-kecheng',
        'icon-fold',

        'icon-up',

        'icon-top',
        'icon-fanhui',

        'icon-iconset0103',

        'icon-shanchu',

        'icon-quan',

        'icon-demo',

        'icon-tuichu',

        'icon-tianjia',

        'icon-shangpinguanli',

        'icon-add',

        'icon-rizhiguanli',

        'icon-naozhongxiaoxitixing',

        'icon-gengduo',

        'icon-weibaoxitongshangchuanlogo-',

        'icon-loading',

        'icon-huiyuanguanli',
      ],
    }
  },
  // 计算属性设置
  computed: {},
  // 数据变更监听
  watch: {},
  mounted() {
    this.init()
  },
  // 当页面使用路由参数时, 参数部分变化触发的动作在本函数中操作
  // https://router.vuejs.org/zh/guide/advanced/navigation-guards.htmll#组件内的守卫
  // beforeRouteUpdate(to, from, next) {
  //   // this.name = to.params.name
  //   // this.init()
  //   // next()
  // },
  methods: {
    // 执行获取数据等初始化动作
    init() {},
  },
}
</script>

<style lang="scss" scoped>
@import '../../../assets/style/container';
</style>
