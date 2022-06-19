<template>
  <div class="container">
    <div class="title">
      <span v-if="!edit_book_id">新增书籍</span><span v-else>修改书籍 - ID: {{ book_id }}</span>
      <span class="back" @click="back"> <i class="iconfont icon-fanhui"></i> 返回 </span>
      <span v-if="edit_book_id" class="next" @click="next"> <i class="el-icon-arrow-right"></i> 下一本 </span>
      <span v-if="edit_book_id" class="previous" @click="previous"> <i class="el-icon-arrow-left"></i> 上一本 </span>
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
              <el-form-item label="书籍图片" prop="cover">
                <upload-imgs
                  ref="uploadEle1"
                  :rules="rules"
                  :multiple="false"
                  :value="coverPreview"
                  :max-num="1"
                  accept="image/png,image/jpeg,image/gif,image/jpg"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="ISBN" prop="isbn">
                <el-input size="medium" v-model="form.isbn" placeholder="请输入ISBN"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="书名" prop="title">
                <el-input size="medium" v-model="form.title" placeholder="请输入书名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="副标题" prop="subtitle">
                <el-input size="medium" v-model="form.subtitle" placeholder="请输入副标题"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="书籍类别" prop="book_type">
                <el-select v-model="form.book_type" filterable default-first-option placeholder="请选择书籍类别">
                  <el-option
                    v-for="item in book_types"
                    :key="Number(item.item_code)"
                    :label="item.item_name"
                    :value="Number(item.item_code)"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="类型/作者" prop="author1">
                <el-input v-model="form.author1" size="medium" class="input-with-select">
                  <el-select v-model="form.author_type1" slot="prepend" placeholder="请选择">
                    <el-option
                      v-for="item in author_types"
                      :key="Number(item.item_code)"
                      :label="item.item_name"
                      :value="Number(item.item_code)"
                    ></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="类型/作者" prop="author2">
                <el-input v-model="form.author2" size="medium" class="input-with-select">
                  <el-select v-model="form.author_type2" slot="prepend" placeholder="请选择">
                    <el-option
                      v-for="item in author_types"
                      :key="Number(item.item_code)"
                      :label="item.item_name"
                      :value="Number(item.item_code)"
                    ></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="类型/作者" prop="author3">
                <el-input v-model="form.author3" size="medium" class="input-with-select">
                  <el-select v-model="form.author_type3" slot="prepend" placeholder="请选择">
                    <el-option
                      v-for="item in author_types"
                      :key="Number(item.item_code)"
                      :label="item.item_name"
                      :value="Number(item.item_code)"
                    ></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="出版公司" prop="press">
                <el-input size="medium" v-model="form.press" placeholder="请输入出版公司"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="印刷公司" prop="printing">
                <el-input size="medium" v-model="form.printing" placeholder="请输入印刷公司"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="开本" prop="kaiben">
                <el-input size="medium" v-model="form.kaiben" placeholder="请输入开本"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="字数" prop="word_count">
                <el-input size="medium" v-model="form.word_count" placeholder="请输入字数"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="印张" prop="yinzhang">
                <el-input size="medium" v-model="form.yinzhang" placeholder="请输入印张"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="版次" prop="edition_number">
                <el-input size="medium" v-model="form.edition_number" placeholder="请输入版次"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="印次" prop="impression">
                <el-input size="medium" v-model="form.impression" placeholder="请输入印次"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="定价" prop="price">
                <el-input size="medium" v-model="form.price" placeholder="请输入定价"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="册数" prop="volumes">
                <el-input size="medium" v-model="form.volumes" placeholder="请输入册数"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="购买日期" prop="date_purchased">
                <el-date-picker
                  v-model="form.date_purchased"
                  type="date"
                  placeholder="选择购买日期"
                  value-format="timestamp"
                  :picker-options="pickerOptions"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="是否已读" prop="is_read">
                <el-checkbox v-model="form.is_read">已读</el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-show="form.is_read">
              <el-form-item label="评分" prop="rate">
                <el-rate v-model="form.rate" show-text :texts="texts" :colors="colors3"></el-rate>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="edit_book_id">
              <el-form-item label="编辑次数" prop="version">
                <div>{{ form.version }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="读后感" prop="summary">
                <el-input
                  size="medium"
                  type="textarea"
                  :autosize="{ minRows: 4, maxRows: 8 }"
                  placeholder="请输入读后感"
                  v-model="form.summary"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item class="submit">
                <el-button type="primary" @click="submitForm('form')" :loading="loading">保 存</el-button>
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
import book from '@/model/book'
import baseApi from '@/model/base'
import UploadImgs from '@/component/base/upload-image'

export default {
  props: {
    edit_book_id: {
      type: Number,
      default: null,
    },
  },
  name: 'ImgsUploadStage1',
  components: {
    UploadImgs,
  },
  data() {
    return {
      form: {
        isbn: '',
        date_purchased: new Date(),
        volumes: '1',
        is_read: false,
        summary: '',
      },
      book_id: '',
      book_types: [],
      author_types: [],
      loading: false,
      fit: 'cover',
      rules: {
        minWidth: 500,
        minHeight: 500,
        //maxWidth: 500,
        //maxHeight: 500,
        maxSize: 5,
        isbn: [{ required: true, message: '请输入ISBN', trigger: 'blur' }],
        title: [{ required: true, message: '请输入书名', trigger: 'blur' }],
        book_type: [{ required: true, message: '请选择书籍类型', trigger: 'change' }],
        author1: [{ required: true, message: '请输入作者', trigger: 'blur' }],
        press: [{ required: true, message: '请输入出版公司', trigger: 'change' }],
        //date_purchased: [{ required: true, message: '请选择购买日期', trigger: 'change' }],
      },
      coverPreview: [],
      colors3: { 5: '#FFDD55' },
      texts: ['极差', '失望', '一般', '满意', '惊喜'],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
      },
    }
  },
  async created() {
    let arr = await baseApi.getItems({
      typeCode: 'Book.Type',
    })
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].status == 1) {
        this.book_types.push(arr[i])
      }
    }
    //赋初值会导致下拉选项变更后无法立即刷新，必须更新页面其他控件值才能正确显示
    //this.form.book_type = Number(this.book_types[0].item_code)

    arr = await baseApi.getItems({
      typeCode: 'Author.Type',
    })
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].status == 1) {
        this.author_types.push(arr[i])
      }
    }
    //this.form.author_type1 = Number(this.author_types[0].item_code)
  },
  async mounted() {
    this.loading = true
    if (this.edit_book_id) {
      this.book_id = this.edit_book_id
    }
    if (this.book_id) {
      this.form = await book.getBook(this.book_id)
      this.coverPreview.length = 0
      if (this.form.author_type2 === 0) this.form.author_type2 = ''
      if (this.form.author_type3 === 0) this.form.author_type3 = ''
      if (this.form.cover) {
        this.coverPreview.push({
          id: this.form.id,
          display: this.form.cover,
          src: this.form.cover,
          imgId: this.form.id,
        })
      }
    }
    this.loading = false
  },
  methods: {
    async submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.loading = true
          if (!this.form.author_type2) this.form.author_type2 = 0
          if (!this.form.author_type3) this.form.author_type3 = 0
          let t = new Date()
          t.setTime(this.form.date_purchased + 1000 * 60 * 60 * 8)
          this.form.date_purchased = t
          let cover = await this.$refs['uploadEle1'].getValue()
          if (cover.length > 0) {
            this.form.cover = cover[0].src
          } else {
            this.form.cover = ''
          }
          let res
          if (this.book_id) {
            try {
              res = await book.editBook(this.book_id, this.form)
              if (res.code < window.MAX_SUCCESS_CODE) {
                this.loading = false
                this.$message.success(`${res.message}`)
                this.$emit('editClose')
              }
            } catch (error) {
              this.loading = false
              this.$message.error('书籍更新失败，请检测输入信息')
              console.log(error)
            }
          } else {
            try {
              res = await book.createBook(this.form)
              this.loading = false
              if (res.code < window.MAX_SUCCESS_CODE) {
                this.$message.success(`${res.message}`)
                this.resetForm(formName)
              }
            } catch (error) {
              this.loading = false
              this.$message.error('书籍新增失败，请检测输入信息')
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
      this.form.book_type = Number(this.book_types[0].item_code)
      this.form.author_type1 = Number(this.author_types[0].item_code)
      this.form.author_type2 = ''
      this.form.author_type3 = ''
      this.form.is_read = 'false'
    },
    async previous() {
      try {
        this.book_id = this.book_id - 1
        this.form = await book.getBook(this.book_id)
        this.coverPreview.length = 0
        if (this.form.cover) {
          this.coverPreview.push({
            id: this.form.id,
            display: this.form.cover,
            src: this.form.cover,
            imgId: this.form.id,
          })
        }
      } catch (error) {
        this.book_id = this.book_id + 1
      }
    },
    async next() {
      try {
        this.book_id = this.book_id + 1
        this.form = await book.getBook(this.book_id)
        this.coverPreview.length = 0
        if (this.form.cover) {
          this.coverPreview.push({
            id: this.form.id,
            display: this.form.cover,
            src: this.form.cover,
            imgId: this.form.id,
          })
        }
      } catch (error) {
        this.book_id = this.book_id - 1
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
