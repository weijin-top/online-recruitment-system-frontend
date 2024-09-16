<template>
  <el-tag v-if="status === 0 ">正在面试</el-tag>
  <el-tag v-else-if="status === 1 " type="success">面试通过</el-tag>
  <el-tag v-else-if="status === 2 " type="danger">面试不通过</el-tag>
</template>

<script>
export default {
  name: 'InterviewResultMap',
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
