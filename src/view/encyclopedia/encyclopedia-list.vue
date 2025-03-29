<template>
  <div>
    <!-- 列表页面 -->
    <div class="container" v-show="!showForm">
      <sticky-top>
        <div class="header">
          <div class="header-left">
            <p class="title">词条列表</p>
          </div>
          <div class="header-right">
            <el-cascader
              :options="provenances"
              clearable
              change-on-select
              placeholder="筛选出处"
              v-model="selected_provenance_value"
              @change="handleChange"
              size="small"
              style="width: 230px"
            ></el-cascader>
            <el-select
              size="small"
              v-model="item_type"
              filterable
              placeholder="筛选类别"
              @change="handleChange"
              clearable
              style="width: 100px; margin-left: 10px"
            >
              <el-option
                v-for="item in item_types"
                :key="Number(item.item_code)"
                :label="item.item_name"
                :value="Number(item.item_code)"
              ></el-option>
            </el-select>
            <lin-search @query="onQueryChange" placeholder="请输入词条名/拼音" size="small" style="margin-left: 10px" />
            <el-switch
              v-model="exactMatch"
              @change="onQueryChange"
              active-color="#3963bc"
              active-text="精确查询"
              inactive-text="模糊查询"
              style="margin-left: 10px"
            />
            <el-button
              type="primary"
              icon="el-icon-plus"
              v-permission="'新增词条'"
              style="margin-left: 10px"
              @click="
                () => {
                  ;(showForm = true), (this.edit_item_id = null)
                }
              "
              >新增</el-button
            >
            <el-button type="default" icon="el-icon-refresh" @click="refresh">刷新</el-button>
            <!-- <el-button icon="el-icon-download" @click="exprotExcel">导出</el-button> -->
          </div>
        </div>
      </sticky-top>
      <!-- 表格 -->
      <lin-table
        :tableColumn="tableColumn"
        :tableData="tableData"
        :operate="operate"
        :pagination="pagination"
        @handleEdit="handleEdit"
        @handleDelete="handleDelete"
        @currentChange="handleCurrentPageChange"
        @sizeChange="handlePageSizeChange"
        @row-click="rowClick"
        v-loading="loading"
      >
        <template v-slot:name="scope">
          <span
            >{{ scope.row.name
            }}{{ scope.row.alias !== null && scope.row.alias !== '' ? '（' + scope.row.alias + '）' : '' }}</span
          >
        </template>
      </lin-table>
    </div>

    <!-- 编辑页面 -->
    <encyclopedia-form
      v-if="showForm"
      @editClose="editClose"
      :edit_item_id="edit_item_id"
      :last_provenance="last_provenance"
    ></encyclopedia-form>
  </div>
</template>

<script>
import encyclopedia from '@/model/encyclopedia'
import baseApi from '@/plugin/base/model/base'
import LinTable from '@/component/base/table/lin-table'
import LinSearch from '@/component/base/search/lin-search'
import EncyclopediaForm from './encyclopedia-form'

export default {
  components: {
    LinTable,
    LinSearch,
    EncyclopediaForm,
  },
  data() {
    return {
      item_types: [],
      tableColumn: [
        { prop: 'item_type_name', label: '所属类别', align: 'center', width: 100 },
        { prop: 'name, alias', label: '词条名称', scope: 'name', scopedSlots: { customRender: 'name' } },
        { prop: 'pronunciation', label: '读音' },
        { prop: 'explanation', label: '释名', width: 150 },
        { prop: 'provenance', label: '出处', width: 270 },
        { prop: 'effect', label: '作用', width: 150 },
      ],
      tableData: [],
      operate: [],
      loading: false,
      showForm: false,
      edit_item_id: 1,
      last_provenance: '',
      pagination: {
        pageSize: 10,
        pageTotal: 0,
        currentPage: 1, // 默认获取第一页的数据
      },
      provenances: [],
      selected_provenance_value: '',
      item_type: '',
      searchKeyword: '',
      exactMatch: false,
    }
  },
  async created() {
    this.loading = true
    this.operate = [
      { name: '编辑', func: 'handleEdit', type: 'primary', permission: '更新词条' },
      {
        name: '删除',
        func: 'handleDelete',
        type: 'danger',
        permission: '删除词条',
      },
    ]
    let arr = await baseApi.getItems({
      typeCode: 'Encyclopedia.Type',
    })
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].status == 1) {
        this.item_types.push(arr[i])
      }
    }
    await this.getProvenances()
    await this.getEncyclopedias()
    this.loading = false
  },
  methods: {
    // 下拉框选择分组
    async handleChange() {
      this.loading = true
      this.pagination.currentPage = 1
      await this.getEncyclopedias()
      this.loading = false
    },
    // 切换table页
    async handleCurrentPageChange(val) {
      this.loading = true
      console.log('handleCurrentPageChange: ' + val)
      this.pagination.currentPage = val
      await this.getEncyclopedias()
      this.loading = false
    },
    async handlePageSizeChange(val) {
      this.loading = true
      this.pagination.pageSize = val
      await this.getEncyclopedias()
      this.loading = false
    },
    async getProvenances() {
      let arr = await baseApi.getItems({ typeCode: 'Provenance.Type' })
      const filteredArr = arr.filter(item => item.status)
      const firstLevelNames = ['山經', '海經'] // 一级分类
      const secondLevelNames = ['南山經', '西山經', '北山經', '東山經', '中山經', '海外經', '海内經', '大荒經'] // 二级分类
      const thirdLevelNames = {
        南山經: ['南次一經', '南次二經', '南次三經'],
        西山經: ['西次一經', '西次二經', '西次三經', '西次四經'],
        北山經: ['北次一經', '北次二經', '北次三經'],
        東山經: ['東次一經', '東次二經', '東次三經', '東次四經'],
        中山經: [
          '中次一經',
          '中次二經',
          '中次三經',
          '中次四經',
          '中次五經',
          '中次六經',
          '中次七經',
          '中次八經',
          '中次九經',
          '中次十經',
          '中次一十一山經',
          '中次十二經',
        ],
        海外經: ['海外南經', '海外西經', '海外北經', '海外東經'],
        海内經: ['海内南經', '海内西經', '海内北經', '海内東經'],
        大荒經: ['大荒東經', '大荒南經', '大荒西經', '大荒北經', '海内經'],
      }
      // 创建一级分类
      const optionsMap = {}
      firstLevelNames.forEach(name => {
        const item = filteredArr.find(i => i.item_name === name)
        if (item) {
          optionsMap[name] = {
            value: item.item_details, // 动态获取 value
            label: item.item_name,
            children: [],
          }
        }
      })

      // 创建二级分类
      const secondLevelMap = {}
      secondLevelNames.forEach(name => {
        const item = filteredArr.find(i => i.item_name === name)
        if (item) {
          const parentKey = name.includes('山') ? '山經' : '海經'
          secondLevelMap[name] = {
            value: item.item_details, // 动态获取 value
            label: item.item_name,
            children: [],
          }
          optionsMap[parentKey].children.push(secondLevelMap[name])
        }
      })

      // 归类三级分类
      filteredArr.forEach(item => {
        const { item_name: label, item_details: value } = item

        // 检查当前 label 是否属于某个 thirdLevelNames 的子分类
        for (const [parentKey, thirdLevelItems] of Object.entries(thirdLevelNames)) {
          if (thirdLevelItems.includes(label) && !value.includes(',')) {
            if (secondLevelMap[parentKey]) {
              secondLevelMap[parentKey].children.push({ value, label })
            }
            break // 一旦找到匹配，停止循环，提高效率
          }
        }
      })

      // 转换成数组格式返回
      this.provenances = Object.values(optionsMap)
    },
    async getEncyclopedias() {
      const currentPage = this.pagination.currentPage - 1
      try {
        let res = await encyclopedia.getEncyclopedias({
          keyword: this.searchKeyword,
          provenanceType: this.selected_provenance_value[this.selected_provenance_value.length - 1],
          itemType: this.item_type,
          exactMatch: this.exactMatch,
          count: this.pagination.pageSize,
          page: currentPage,
        })
        this.tableData = [...res.items]
        this.pagination.pageTotal = res.count
        this.last_provenance = this.tableData[0].provenance
      } catch (error) {
        console.log(error)
        if (error.code === 10020) {
          this.tableData = []
        }
      }
    },
    // 搜索
    async onQueryChange(query) {
      this.loading = true
      if (typeof query === 'string') this.searchKeyword = query.replace(' ', '').trim()
      this.pagination.currentPage = 1
      await this.getEncyclopedias()
      this.loading = false
    },
    handleEdit(val) {
      this.showForm = true
      this.edit_item_id = val.row.id
    },
    handleDelete(val) {
      this.$confirm('此操作将永久删除词条：' + val.row.name + '，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        this.loading = true
        const res = await encyclopedia.deleteEncyclopedia(val.row.id)
        this.loading = false
        if (res.code < window.MAX_SUCCESS_CODE) {
          await this.getEncyclopedias()
          this.$message({
            type: 'success',
            message: `${res.message}`,
          })
        }
      })
    },
    async refresh() {
      this.loading = true
      await this.getEncyclopedias()
      this.loading = false
      this.$message.success('刷新成功')
    },
    rowClick() {},
    async editClose() {
      this.loading = true
      this.showForm = false
      await this.getEncyclopedias()
      this.loading = false
    },
    // 导出表格
    // exprotExcel() {
    //   // 动态导入
    //   import('@/lin/util/exportExcel').then(async excel => {
    //     const tHeader = ['所属类别', '词条名称', '别名', '出处']
    //     const filterVal = ['item_type_name', 'name', 'alias', 'provenance']
    //     const data = await this.formatJson(filterVal)
    //     excel.export_json_to_excel({
    //       header: tHeader,
    //       data,
    //       filename: 'table-list',
    //     })
    //   })
    // },
    // 将表单格式化为json数据
    // async formatJson(filterVal) {
    //   let res = await encyclopedia.getEncyclopedias({
    //     keyword: this.searchKeyword,
    //     itemType: this.item_type,
    //     exactMatch: this.exactMatch,
    //     count: 99999,
    //     page: 1,
    //   })
    //   let tableData = [...res.items]
    //   return tableData.map(v =>
    //     filterVal.map(j => {
    //       if (j === 'timestamp') {
    //         return ParseTime(v[j])
    //       }
    //       return v[j]
    //     }),
    //   )
    // },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/list.scss';
</style>
