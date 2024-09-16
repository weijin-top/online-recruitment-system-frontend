<template>
  <el-tag v-if="education === 0 ">不限</el-tag>
  <el-tag v-else-if="education === 1 ">小学</el-tag>
  <el-tag v-else-if="education === 2 ">初中</el-tag>
  <el-tag v-else-if="education === 3 ">高中</el-tag>
  <el-tag v-else-if="education === 4 ">大专</el-tag>
  <el-tag v-else-if="education === 5 ">本科</el-tag>
  <el-tag v-else-if="education === 6 ">硕士</el-tag>
  <el-tag v-else-if="education === 7 ">博士</el-tag>
</template>

<script>
export default {
  name: 'EducationMap',
  props: {
    education: {
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
