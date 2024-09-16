<!--
 * @Author: 魏进 3413105907@qq.com
 * @Date: 2024-09-08 17:05:51
 * @LastEditors: 魏进 3413105907@qq.com
 * @LastEditTime: 2024-09-10 10:30:11
 * @FilePath: \online-recruitment-system\src\components\Map\deliveryStatusMap.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-tag v-if="status === 0 ">未查看</el-tag>
  <el-tag v-else-if="status === 1 ">已查看</el-tag>
  <el-tag v-else-if="status === 2 ">感兴趣</el-tag>
  <el-tag v-else-if="status === 3 ">邀约面试</el-tag>
</template>

<script>
export default {
  name: 'DeliveryStatusMap',
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
