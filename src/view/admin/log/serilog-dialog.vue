<template>
  <el-dialog title="Serilog日志详细" :append-to-body="true" :before-close="handleClose" v-model="dialogFormVisible">
    <div style="margin-top:-25px;">
      <el-form status-icon v-if="dialogFormVisible" ref="form" label-width="120px" :model="form"
        label-position="labelPosition" style="margin-left:-35px;margin-bottom:-35px;margin-top:15px;">
        <el-form-item label="消息" prop="message">
          <span>{{ form.message }}</span>
        </el-form-item>
        <el-row :gutter="10">
          <el-col :xs="12">
            <el-form-item label="创建时间" prop="timestamp">
              <span>{{ $filters.filterTimeYmdHms(form.timestamp) }}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="12">
            <el-form-item label="级别" prop="level">
              <el-tag size="medium" :type="formatlogLevelType(form.level)">{{ formatLogLevels(form.level) }}</el-tag>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="属性" prop="properties">
          <pre>{{ form.properties }}</pre>
        </el-form-item>
        <el-form-item label="异常" prop="exception">
          <pre>{{ form.exception }}</pre>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer" style="padding-left:5px;">
        <el-button type="default" @click="handleClose">关闭</el-button>
      </div>
    </template>

  </el-dialog>
</template>

<script>
import Utils from '@/lin/util/util'
var vm
export default {
  name: 'SerilogDialog',
  data() {
    vm = this
    return {
      dialogFormVisible: false,
      loading: false,
      form: {},
      logLevels: [
        {
          level: 0,
          text: 'Trace',
          class: 'default',
        },
        {
          level: 1,
          text: 'Debug',
          class: 'info',
        },
        {
          level: 2,
          text: 'Information',
          class: 'success',
        },
        {
          level: 3,
          text: 'Warning',
          class: 'warning',
        },
        {
          level: 4,
          text: 'Error',
          class: 'danger',
        },
        {
          level: 5,
          text: 'Critical',
          class: 'default',
        },
        {
          level: 6,
          text: 'None',
          class: 'info',
        },
      ],
    }
  },
  computed: {},
  methods: {
    formatLogLevels(level) {
      if (level < vm.logLevels.length) {
        return vm.logLevels[level].text
      } else {
        return 'none'
      }
    },
    formatlogLevelType(level) {
      if (level < vm.logLevels.length) {
        return vm.logLevels[level].class
      } else {
        return 'info'
      }
    },
    show(record) {
      Object.assign(this.form, record)
      this.form.properties = JSON.parse(this.form.properties)
      this.dialogFormVisible = true
    },
    handleClose() {
      this.dialogFormVisible = false
    },
  },
}
</script>

<style lang="scss" scoped>
pre {
  white-space: pre-wrap;
  /* css-3 */
  white-space: -moz-pre-wrap;
  /* Mozilla, since 1999 */
  white-space: -pre-wrap;
  /* Opera 4-6 */
  white-space: -o-pre-wrap;
  /* Opera 7 */
  word-wrap: break-word;
  /* Internet Explorer 5.5+ */
}
</style>
