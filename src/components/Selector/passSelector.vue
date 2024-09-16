
<template>
  <el-select
    v-model="currentValue"
    :multiple="multi"
    filterable
    remote
    reserve-keyword
    clearable
    automatic-dropdown
    placeholder="选择结果"
    class="filter-item"
    @change="handlerChange"
  >
    <el-option
      v-for="item in dataList"
      :key="item.value"
      :label="item.name"
      :value="item.value"
    />
  </el-select>
</template>

<script>
export default {
  name: 'PassSelector',
  props: {
    multi: {
      type: Boolean,
      default: false
    },
    isShowNoLimit: {
      type: Boolean,
      default: true
    },
    status: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      dataList: [
        {
          name: '通过',
          value: 1
        },
        {
          name: '不通过',
          value: 2
        }
      ],
      currentValue: []
    }
  },

  watch: {
    // 检测查询变化
    status: {
      handler() {
        this.currentValue = this.status
      }
    }
  },
  created() {
    this.currentValue = this.status
  },
  methods: {
    handlerChange(e) {
      const obj = this.dataList.find((item) => {
        return item.value === e
      })

      this.$emit('change', obj)
      this.$emit('input', e)
    }
  }
}
</script>
