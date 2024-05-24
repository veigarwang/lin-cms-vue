<template>
  <div class="container">
    <sticky-top>
      <div class="title">
        <span>编辑分组权限</span>
        <span class="back" @click="goBack"> <i class="iconfont icon-fanhui"></i> 返回 </span>
      </div>
    </sticky-top>
    <div class="content">
      <el-row>
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <div class="content">
            <group-permissions :id="$route.query.id" ref="groupPermissionRef" @getCacheAuthIds="getCacheAuthIds">
            </group-permissions>
          </div>
          <div style="padding-left: 5px; margin-top: 30px; text-align: right">
            <el-button type="primary" @click="confirmEdit" :loading="loading">确 定</el-button>
            <el-button @click="goBack">返回</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Admin from '@/lin/model/admin'
import GroupPermissions from './group-permission'
import { ElMessage } from 'element-plus'

const router = useRouter()
const $route = useRoute()
let permissions = ref([])
let cachePermissions = ref([])

const loading = ref(false)

onMounted(async () => {})

const groupPermissionRef = ref()
const confirmEdit = async () => {
  let addRes = 0
  let delRes = 0
  loading.value = true
  permissions.value = groupPermissionRef.value.getCheckedKeys()
  if (permissions.value.toString() !== cachePermissions.value.toString()) {
    const deletePermissions = cachePermissions.value
      .concat(permissions.value)
      .filter(v => !permissions.value.includes(v))
    const addPermissions = cachePermissions.value
      .concat(permissions.value)
      .filter(v => !cachePermissions.value.includes(v))

    if (addPermissions.length > 0) {
      addRes = await Admin.dispatchPermissions($route.query.id, addPermissions)
    }
    if (deletePermissions.length > 0) {
      delRes = await Admin.removePermissions($route.query.id, deletePermissions)
    }
    loading.value = false
    groupPermissionRef.value.getGroupPermissions()
    ElMessage.success('权限修改成功')
    router.push('/admin/group/list')
  }
}

const updatePermissions = val => {
  permissions.value = val
}

const getCacheAuthIds = val => {
  cachePermissions.value = val
}

const goBack = () => {
  router.push('/admin/group/list')
}
</script>
<style lang="scss" scoped>
@import '@/assets/style/form.scss';
.container {
  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
    text-indent: 40px;
    border-bottom: 1px solid #dae1ec;
  }

  .content {
    margin-top: 10px;
    padding-left: 33px;
    padding-right: 40px;
  }

  .submit {
    float: right;
  }
}
</style>
