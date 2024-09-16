
<template>
  <el-select
    v-model="currentValue"
    :multiple="multi"
    filterable
    remote
    reserve-keyword
    clearable
    automatic-dropdown
    placeholder="选择学历"
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
  name: 'EduSelector',
  props: {
    multi: {
      type: Boolean,
      default: false
    },
    isShowNoLimit: {
      type: Boolean,
      default: true
    },
    education: {
      type: Number,
      default: null
    }
    // value: String | Array,
    // excludes: Array
  },
  data() {
    return {
      // isShowNoLimit: true,
      // 下拉选项值
      dataList: [
        {
          name: '小学',
          value: 1
        },
        {
          name: '初中',
          value: 2
        },
        {
          name: '高中',
          value: 3
        },
        {
          name: '大专',
          value: 4
        },
        {
          name: '本科',
          value: 5
        },
        {
          name: '硕士',
          value: 6
        },
        {
          name: '博士',
          value: 7
        }
      ],
      currentValue: []
    }
  },

  watch: {
    // 检测查询变化
    education: {
      handler() {
        this.currentValue = this.education
      }
    }
  },
  created() {
    this.currentValue = this.education
    this.addDataList()
  },
  methods: {
    addDataList() {
      if (this.isShowNoLimit) {
        this.dataList.unshift({
          name: '不限',
          value: 0
        })
      }
    },
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
