
<template>
  <el-cascader
    v-model="currentValue"
    placeholder="请选择或搜索职位类型"
    :options="options"
    :props="{ emitPath: false }"
    filterable
    clearable
    @focus="initData()"
    @change="handleChange"
  />
</template>

<script>
import { queryPost } from '@/api/post'

export default {
  name: 'PostSelector',
  props: {
    post: {
      type: Number,
      default: null
    },
    isEnableAutoInitData: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentValue: '',
      options: []
    }
  },
  watch: {
    post(newVal) {
      this.currentValue = newVal
    },
    isEnableAutoInitData(newVal, oldVal) {
      // 执行你需要的操作
      console.log('New isEnableAutoInitData received:', newVal)
      this.initData()
    }
  },
  created() {
    // 不需要回显就不用获取数据
    if (!this.isEnableAutoInitData) {
      return
    }
    this.initData()
  },
  methods: {
    initData() {
      // 初始化页面后就不需要点击级联选择器获取数据
      if (this.options.length !== 0) {
        return
      }
      this.getPost()
    },
    getPost() {
      queryPost().then(res => {
        if (res.code) {
          this.formatData(res.data)
        }
      })
    },
    formatData(data) {
      // 假设 data 是一个数组，每个元素有 id 和 name 属性
      const formattedOptions = data.map(item => ({
        value: item.id,
        label: item.name,
        // 如果有子项，可以在这里添加 children 属性
        children: this.formatChildren(item.postVOS)
      }))
      this.options = formattedOptions
    },
    formatChildren(childrenData) {
      if (childrenData === null) {
        return
      }
      // 递归处理子级别数据
      if (childrenData && childrenData.length > 0) {
        return childrenData.map(child => ({
          value: child.id,
          label: child.name,
          children: this.formatChildren(child.postVOS) // 递归处理更深层次的子项
        }))
      }
    },
    handleChange(value) {
      // 当值改变时触发事件并传递给父组件
      this.$emit('input', value)
      // 自定义事件
      this.$emit('selectedChange', value)
    }
  }
}

</script>
