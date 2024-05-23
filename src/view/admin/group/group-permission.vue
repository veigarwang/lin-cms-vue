<template>
  <el-auto-resizer>
    <el-tree-v2
      ref="tree"
      :data="data"
      show-checkbox
      check-on-click-node
      node-key="id"
      :height="500"
      :props="defaultProps"
      @check-change="handleCheckChange"
    >
    </el-tree-v2
  ></el-auto-resizer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Admin from '@/lin/model/admin'
var data = ref({})

const props = defineProps(['id', 'title'])

const emit = defineEmits(['updatePermissions', 'getCacheAuthIds'])

onMounted(async () => {
  data.value = await Admin.GetPermissionNodes()
  await getGroupPermissions()
})

const tree = ref()
const getCheckedKeys = () => {
  var checkedKey = tree.value.getCheckedKeys()
  console.log(checkedKey)
  return checkedKey
}

const checkedPermissions = ref([])

const getGroupPermissions = async () => {
  if (props.id) {
    const res = await Admin.getOneGroup(props.id)
    checkedPermissions.value = res.permissions.map(permission => permission.id)
    tree.value.setCheckedKeys(checkedPermissions.value)
    emit('getCacheAuthIds', checkedPermissions.value)
  }
}

defineExpose({
  getCheckedKeys,
  getGroupPermissions,
})

const defaultProps = {
  children: 'children',
  label: 'name',
}
</script>
