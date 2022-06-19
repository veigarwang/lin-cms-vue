<template>
  <div class="container">
    <div class="title">
      <span v-if="!edit_item_id">新增词条</span><span v-else>修改词条 - ID: {{ item_id }}</span>
      <span class="back" @click="back"> <i class="iconfont icon-fanhui"></i> 返回 </span>
      <span v-if="edit_item_id" class="next" @click="next"> <i class="el-icon-arrow-right"></i> 下一条 </span>
      <span v-if="edit_item_id" class="previous" @click="previous"> <i class="el-icon-arrow-left"></i> 上一条 </span>
    </div>
    <el-divider></el-divider>
    <div class="wrap">
      <el-row>
        <el-col>
          <el-form
            :model="form"
            status-icon
            ref="form"
            label-width="100px"
            v-loading="loading"
            :rules="rules"
            @submit.native.prevent
          >
            <el-col :span="6">
              <el-form-item label="词条图片" prop="picture">
                <upload-imgs
                  ref="uploadEle1"
                  :rules="rules"
                  :multiple="false"
                  :value="picturePreview"
                  :max-num="1"
                  accept="image/png,image/jpeg,image/gif,image/jpg"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="词条名" prop="name">
                <el-input size="medium" v-model="form.name" placeholder="请输入词条名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="读音" prop="pronunciation">
                <el-input size="medium" v-model="form.pronunciation" placeholder="请输入读音"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="别名" prop="alias">
                <el-input size="medium" v-model="form.alias" placeholder="请输入别名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="释名" prop="explanation">
                <el-input size="medium" v-model="form.explanation" placeholder="请输入释名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="所属类别" prop="item_type">
                <el-select v-model="form.item_type" filterable default-first-option placeholder="请选择所属类别">
                  <el-option
                    v-for="item in item_types"
                    :key="Number(item.item_code)"
                    :label="item.item_name"
                    :value="Number(item.item_code)"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="作用" prop="effect">
                <el-input size="medium" v-model="form.effect" placeholder="请输入作用"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="出处" prop="provenance">
                <el-input size="medium" v-model="form.provenance" placeholder="请输入出处"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6"> </el-col>
            <el-col :span="6" v-if="edit_item_id">
              <el-form-item label="编辑次数" prop="version">
                <div>{{ form.version }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="经文" prop="original_text">
                <el-input
                  size="medium"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  placeholder="请输入经文"
                  v-model="form.original_text"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="郭注" prop="guozhu">
                <el-input
                  size="medium"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  placeholder="请输入郭注"
                  v-model="form.guozhu"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="图赞" prop="tuzan">
                <el-input
                  size="medium"
                  type="textarea"
                  :autosize="{ minRows: 1, maxRows: 2 }"
                  placeholder="请输入图赞"
                  v-model="form.tuzan"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="集解" prop="jijie">
                <el-input
                  size="medium"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  placeholder="请输入集解"
                  v-model="form.jijie"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="聖解" prop="remarks">
                <el-input
                  size="medium"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  placeholder="请输入聖解"
                  v-model="form.remarks"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item class="submit">
                <el-button type="primary" @click="submitForm('form', false)" :loading="loading">保 存</el-button>
                <el-button type="primary" v-if="!edit_item_id" @click="submitForm('form', true)" :loading="loading"
                  >连续新增</el-button
                >
                <el-button @click="resetForm('form')">重 置</el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import encyclopedia from '@/model/encyclopedia'
import baseApi from '@/model/base'
import UploadImgs from '@/component/base/upload-image'
import Utils from 'lin/util/util'
import { pinyinUtil } from 'lin/util/pinyin_withtone.js'

export default {
  props: {
    edit_item_id: {
      type: Number,
      default: null,
    },
    last_provenance: {
      type: String,
      default: '',
    },
  },
  name: 'ImgsUploadStage1',
  components: {
    UploadImgs,
  },
  data() {
    return {
      form: {
        name: '',
        pronunciation: '',
        provenance: '',
        original_text: '',
        item_type: ''
      },
      item_id: '',
      item_types: [],
      author_types: [],
      loading: false,
      firstLoad: true,
      fit: 'cover',
      rules: {
        minWidth: 500,
        minHeight: 500,
        //maxWidth: 500,
        //maxHeight: 500,
        maxSize: 5,
        name: [{ required: true, message: '请输入词条名', trigger: 'blur' }],
        item_type: [{ required: true, message: '请选择词条类型', trigger: 'change' }],
      },
      picturePreview: [],
    }
  },
  async created() {
    let arr = await baseApi.getItems({
      typeCode: 'Encyclopedia.Type',
    })
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].status == 1) {
        this.item_types.push(arr[i])
      }
    }
    if (!this.edit_item_id && this.last_provenance)
      this.form.original_text = '《山海經·' + this.last_provenance + '》：'
    //this.form.item_type = Number(this.item_types[0].item_code)

    // 节流搜索
    this.$watch(
      'form.name',
      Utils.debounce(func => {
        var res = pinyinUtil.getPinyin(this.form.name, ' ', true, false)
        if (!this.firstLoad || !this.item_id) {
          this.form.pronunciation = res
        } else {
          this.firstLoad = false
        }
        if (this.form.name.endsWith('山') || this.form.name.endsWith('丘') || this.form.name.endsWith('谷'))
          this.form.item_type = Number(this.item_types[0].item_code)
        else if (
          this.form.name.endsWith('水') ||
          this.form.name.endsWith('澤') ||
          this.form.name.endsWith('湖') ||
          this.form.name.endsWith('海')
        )
          this.form.item_type = Number(this.item_types[1].item_code)
        else if (this.form.name.endsWith('草')) this.form.item_type = Number(this.item_types[2].item_code)
        else if (this.form.name.endsWith('木') || this.form.name.endsWith('樹'))
          this.form.item_type = Number(this.item_types[3].item_code)
        else if (this.form.name.endsWith('虫') || this.form.name.endsWith('蟲'))
          this.form.item_type = Number(this.item_types[4].item_code)
        else if (this.form.name.endsWith('魚')) this.form.item_type = Number(this.item_types[5].item_code)
        else if (this.form.name.endsWith('鳥')) this.form.item_type = Number(this.item_types[6].item_code)
        else if (this.form.name.endsWith('神')) this.form.item_type = Number(this.item_types[8].item_code)
        else if (this.form.name.endsWith('國') || this.form.name.endsWith('城'))
          this.form.item_type = Number(this.item_types[10].item_code)
        else if (this.form.name.endsWith('玉'))
          this.form.item_type = Number(this.item_types[12].item_code)
        else if (this.form.name.endsWith('金') || this.form.name.endsWith('石'))
          this.form.item_type = Number(this.item_types[14].item_code)
      }, 1000),
    ),
      this.$watch(
        'form.original_text',
        Utils.debounce(func => {
          while (this.form.original_text.indexOf(' ') > -1)
            this.form.original_text = this.form.original_text.replace(' ', '')
          var reg = /山海經·(.*?)經/gms
          if (this.form.original_text.search(reg) !== -1) {
            var array = this.form.original_text.match(reg)
            var res = []
            array.forEach(element => {
              var item = element.replace(/山海經·/, '')
              if (res.indexOf(item) == -1) res.push(element.replace(/山海經·/, ''))
            })
            this.form.provenance = res.toString()
            //reg.exec(this.form.original_text).toString()
          }
        }, 1000),
      ),
      this.$watch(
        'form.guozhu',
        Utils.debounce(func => {
          this.form.guozhu = this.form.guozhu
            .replace('，郭璞注：『', '：')
            .replace('。郭璞注：『', '：')
            .replace('、郭璞注：『', '：')
            .replace('郭璞注：『', '：')
            .replace('「', '『')
            .replace('」', '』')
            .replace('』』', '』')
            .replace(' ', '')
          //reg.exec(this.form.original_text).toString()
        }, 1000),
      )
  },
  async mounted() {
    this.loading = true
    if (this.edit_item_id) {
      this.item_id = this.edit_item_id
    }
    if (this.item_id) {
      this.form = await encyclopedia.getEncyclopedia(this.item_id)
      this.picturePreview.length = 0
      if (this.form.picture) {
        this.picturePreview.push({
          id: this.form.id,
          display: this.form.picture,
          src: this.form.picture,
          imgId: this.form.id,
        })
      }
    }
    this.loading = false
  },
  methods: {
    async submitForm(formName, continued) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.loading = true
          let picture = await this.$refs['uploadEle1'].getValue()
          if (picture.length > 0) {
            this.form.picture = picture[0].src
          } else {
            this.form.picture = ''
          }
          let res
          if (this.item_id) {
            try {
              res = await encyclopedia.editEncyclopedia(this.item_id, this.form)
              if (res.code < window.MAX_SUCCESS_CODE) {
                this.loading = false
                this.$message.success(`${res.message}`)
                this.form = await encyclopedia.getEncyclopedia(this.item_id)
                this.firstLoad = true
                //this.$emit('editClose')
              }
            } catch (error) {
              this.loading = false
              this.$message.error('词条更新失败，请检测输入信息')
              console.log(error)
            }
          } else {
            try {
              res = await encyclopedia.createEncyclopedia(this.form)
              this.loading = false
              if (res.code < window.MAX_SUCCESS_CODE) {
                this.last_provenance = this.form.provenance
                this.$message.success(`${res.message}`)
                if (!continued) this.resetForm(formName)
              }
            } catch (error) {
              this.loading = false
              this.$message.error('词条新增失败，请检测输入信息')
              console.log(error)
            }
          }
        } else {
          this.$message.error('请输入正确的信息')
        }
      })
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.$refs['uploadEle1'].clear()
      this.form.item_type = Number(this.item_types[0].item_code)
      if (!this.edit_item_id && this.last_provenance)
        this.form.original_text = '《山海經·' + this.last_provenance + '》：'
    },
    async previous() {
      try {
        this.item_id = this.item_id - 1
        this.firstLoad = true
        this.form = await encyclopedia.getEncyclopedia(this.item_id)
      } catch (error) {
        this.item_id = this.item_id + 1
      }
    },
    async next() {
      try {
        this.item_id = this.item_id + 1
        this.firstLoad = true
        this.form = await encyclopedia.getEncyclopedia(this.item_id)
      } catch (error) {
        this.item_id = this.item_id - 1
      }
    },
    back() {
      this.$emit('editClose')
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/form.scss';
.el-divider--horizontal {
  margin: 0;
}

.container {
  .title {
    .previous {
      float: right;
      margin-right: 30px;
      cursor: pointer;
      z-index: 100;
    }
    .next {
      float: right;
      margin-right: 30px;
      cursor: pointer;
      z-index: -100;
    }
    .back {
      float: right;
      margin-right: 40px;
      cursor: pointer;
    }
  }

  .wrap {
    padding: 20px;
  }

  .submit {
    float: left;
  }
}

.el-rate {
  display: inline-block;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner,
.el-form-item__content > .el-select {
  width: 100%;
}
.input-with-select /deep/ .el-input-group__prepend {
  background-color: #fff;
  width: 50px;
  border-top: 1px solid #dcdfe6;
  border-left: 1px solid #dcdfe6;
  border-bottom: 1px solid #dcdfe6;
  border-right: none;
}
</style>
