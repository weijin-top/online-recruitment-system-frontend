<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="30%"
    center
    @close="handleClose"
  >
    <span>{{ message }}</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="confirmAction">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: '提示'
    },
    message: {
      type: String,
      required: true
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    confirmAction() {
      this.$emit('confirm')
      this.handleClose()
    }
  }
}
</script>

<style scoped>
/* 添加自定义样式 */
</style>
