
<template>
  <el-select
    v-model="currentValue"
    :multiple="multi"
    filterable
    remote
    reserve-keyword
    clearable
    automatic-dropdown
    placeholder="选择职位状态"
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
  name: 'PositionStatusSelector',
  props: {
    multi: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {

      // 下拉选项值
      dataList: [
        {
          name: '未审核',
          value: 0
        },
        {
          name: '通过',
          value: 1
        },
        {
          name: '不通过',
          value: 2
        },
        {
          name: '停止招聘',
          value: 3
        }
      ],
      currentValue: []
    }
  },

  watch: {
    // 检测查询变化
    value: {
      handler() {
        this.currentValue = this.value
      }
    }
  },
  created() {
    this.currentValue = this.value
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
