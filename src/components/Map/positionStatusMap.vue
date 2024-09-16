<template>
  <el-tag v-if="status === 0 ">未审核</el-tag>
  <el-tag v-else-if="status === 1 " type="success">正常</el-tag>
  <el-tag v-else-if="status === 2 " type="danger">未通过</el-tag>
  <el-tag v-else-if="status === 3 " type="info">停止招聘</el-tag>
</template>

<script>
export default {
  name: 'PositionStatusMap',
  props: {
    status: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
    }
  }
}

</script>
