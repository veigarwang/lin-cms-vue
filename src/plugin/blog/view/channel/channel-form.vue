<template>
  <div>
    <sticky-top>
      <div class="title">
        <span>{{ title[this.id == 0 ? 0 : 1] }}</span>
        <span class="back" @click="back">
          <i class="iconfont icon-fanhui"></i> 返回
        </span>
      </div>
    </sticky-top>
    <div class="container">
      <div class="wrap">
        <el-row>
          <el-col :lg="16" :md="20" :sm="24" :xs="24">
            <el-form status-icon ref="form" label-width="120px" :model="form" label-position="labelPosition"
              :rules="rules" style="margin-left:-35px;margin-bottom:-35px;margin-top:15px;">
              <el-form-item label="技术频道" prop="channel_name">
                <el-input size="medium" clearable v-model="form.channel_name"></el-input>
              </el-form-item>
              <el-form-item label="标签" prop="source">
                <el-select style="width:100%;" v-model="form.tag_ids" remote multiple filterable :loading="tagLoading"
                  default-first-option placeholder="添加一个标签" :remote-method="remoteMethod">
                  <el-option v-for="item in tags" :key="item.id" :label="item.tag_name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="封面" prop="thumbnail">
                <upload-imgs ref="thumbnail" :multiple="false" :value="thumbnailPreview" :max-num="1" />
              </el-form-item>
              <el-form-item label="排序码" prop="sort_code">
                <el-input size="medium" type="number" clearable v-model="form.sort_code"></el-input>
              </el-form-item>
              <el-form-item label="编码" prop="channel_code">
                <el-input size="medium" clearable v-model="form.channel_code"></el-input>
              </el-form-item>
              <el-form-item label="备注描述" prop="remark">
                <el-input size="medium" clearable v-model="form.remark"></el-input>
              </el-form-item>
              <el-form-item label="状态" prop="status">
                <el-switch v-model="form.status" active-color="#13ce66" active-text="启用" inactive-text="禁用"></el-switch>
              </el-form-item>
              <el-form-item class="submit">
                <el-button type="primary" @click="confirmEdit('form')">保 存</el-button>
                <el-button @click="resetForm('form')">重 置</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import channelApi from '../../model/channel'
import UploadImgs from '@/component/base/upload-image'
import tagApi from '../../model/tag'

export default {
  name: 'ChannelForm',
  components: { UploadImgs },
  props: {
    id: {
      type: [String, Number],
    },
  },
  data() {
    return {
      title: ['新增技术频道', '编辑技术频道'],
      loading: false,
      form: {
        channel_name: '',
        thumbnail: '',
        sort_code: 0,
        channel_code: '',
        remark: '',
        status: true,
        tag_ids: [],
      },

      thumbnailPreview: [],
      rules: {
        channel_name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        thumbnail: [{ required: true, message: '请上传封面', trigger: 'blur' }],
        channel_code: [{ required: true, message: '请输入编码', trigger: 'blur' }],
      },

      tagLoading: false,
      tags: [],
    }
  },
  async created() {
    const tags = await tagApi.getTags()
    this.tags = tags.items
  },
  async mounted() {
    this.show()
  },
  methods: {
    async show() {
      if (this.id != 0) {
        const res = await channelApi.getChannel(this.id)
        let tag_ids = []
        res.tags.forEach(item => {
          tag_ids.push(item.id)
        })
        res.tag_ids = tag_ids
        this.form = res
        this.thumbnailPreview.length = 0
        if (res.thumbnail) {
          this.thumbnailPreview = [{
            id: res.id,
            display: res.thumbnail_display,
            src: res.thumbnail,
            imgId: res.id,
          }]
        }
        this.tags = res.tags
      } else {
        Object.assign(this.form, {
          channel_name: '',
        })
      }
    },
    async submitForm() {
      if (this.id === 0) {
        return await channelApi.addChannel(this.form)
      } else {
        return await channelApi.editChannel(this.id, this.form)
      }
    },
    async confirmEdit(formName) {
      let thumbnail = await this.$refs['thumbnail'].getValue()
      if (thumbnail.length > 0) {
        this.form.thumbnail = thumbnail[0].src
      } else {
        this.form.thumbnail = ''
      }

      this.$refs[formName].validate(async valid => {
        if (valid) {
          let res
          this.loading = true

          res = await this.submitForm().finally(() => {
            this.loading = false
          })

          this.$message.success(`${res.message}`)
          this.$emit('editClose')
        } else {
          this.$message.error('请填写正确的信息')
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    back() {
      this.$emit('editClose')
    },
    async remoteMethod(query) {
      if (query !== '') {
        this.tagLoading = true
        let tags = await tagApi.getTags({
          tagName: query,
        })
        this.tagLoading = false
        this.tags = tags.items
        let filterTags = []
        tags.items.forEach(r => {
          if (!this.tags.filter(u => u.id == r.id)) {
            filterTags.push(r)
          }
        })
        this.tags.concat(filterTags)
      } else {
        this.tags = []
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/form.scss';
</style>
