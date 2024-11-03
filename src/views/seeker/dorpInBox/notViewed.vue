<template>
  <div class="container" resume-delivery-list>

    <div
      v-for="item in pageData.records"
      :key="item.id"
      class="resume-delivery-container"
    >
      <!-- 职位信息 -->
      <div class="flex-column container-item">
        <div style="font-size: 18px;">
          <span
            :style="{
              color: hoverColor,
              transition: 'color 0.3s' // 添加过渡动画
            }"
            class="positionName-hover"
            @click="toPositionDetail(item.positionId)"
          > {{ item.positionName }} </span>
          <span :style="{ color: item.positionStatus === 3 ? 'gray' : 'inherit' }"> [{{ item.jobPlace }}] </span>
        </div>
        <div>
          <span style="color: red; font-size: 16px" :style="{ color: item.positionStatus === 3 ? 'gray' : 'inherit' }">{{ item.miniSalary /1000 }} - {{ item.maxSalary/1000 }}K</span>
          <span><education-map :education="item.education" /></span>
        </div>
      </div>
      <!-- 公司信息 -->
      <div class="flex-center">
        <img :src="item.companyLogo" style="width: 60px; margin-right: 10px" alt="公司logo">
        <div class="flex-column ">
          <div style="font-size: 18px;" :style="{ color: item.positionStatus === 3 ? 'gray' : 'inherit' }">{{ item.companyNickname }}</div>
          <div style="font-size: 16px; margin-top:10px"> <delivery-status-map :status="item.deliveryStatus" /> </div>
        </div>
      </div>
      <div v-if="item.positionStatus === 3" style="color: gray; font-size: 22px;">停止招聘</div>
      <div v-else />
    </div>
    <!-- 空状态提示 -->
    <div v-if="!pageData.records.length" class="no-data">
      <h2>暂无数据</h2>
      <p>您当前没有可用的数据</p>
    </div>
    <!-- 分页器 -->
    <div v-if="pageData.records.length !== 0" class="block flex-center">
      <el-pagination
        :current-page="pageData.current"
        :page-sizes="[10, 15, 20, 25]"
        :page-size="pageData.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageData.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import EducationMap from '@/components/Map/educationMap'
import DeliveryStatusMap from '@/components/Map/deliveryStatusMap'
import { pageResumeDelivery } from '@/api/resumeDelivery'

export default {
  name: 'NotViewed',
  components: { EducationMap, DeliveryStatusMap },
  data: function() {
    return {
      pageData: {
        records: []
      },
      query: {
        pageNum: 1,
        pageSize: 10,
        status: 0
      },
      hoverColor: 'inherit' // 初始值
    }
  },

  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.listLoading = true
      if (this.query.status === null) {
        delete this.query.status
      }
      const response = await pageResumeDelivery(this.query)
      if (response.code) {
        this.pageData = response.data
      } else {
        this.pageData = []
        this.$message({
          type: 'error',
          message: response.msg
        })
      }
      this.listLoading = false
    },
    handleserach() {
      this.fetchData()
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.query.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.query.pageNum = val
      this.fetchData()
    },
    toPositionDetail(id) {
      const newUrl = this.$router.resolve({
        name: 'PositionDetail',
        query: { id: id }
      })
      window.open(newUrl.href, '_blank')
      // this.$router.push({ name: 'PublishPosition', query: { id: id, title: '修改职位' }})
    }
  }
}
</script>

<style scoped>
.container{
   /* background-color: rgb(255,255,255);*/
    height: 100%;
    width: 1200px;
    margin: 0 auto;
    margin-top: 1em;
    /*padding: 1em;*/
}
.resume-delivery-container{
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgb(255,255,255);
  height: 100px;
  padding: 0 2em;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}
.block{
  /* 水平居中 */
  margin-top: 3em;
}
.flex-center{
  display: flex;
  justify-content: center;
  align-items: center;
}
.flex-column{
  display: flex;
  flex-direction: column;
}
.container-item > div{
  margin: 6px 0;
}
.container-item > div >span{
  margin-right: 10px;
}

.resume-delivery-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 30vh; /* 占据整个视口高度 */
  text-align: center;
}

.no-data h2 {
  margin-bottom: 10px;
}

.no-data p {
  color: #666;
}
.positionName-hover:hover{
  cursor: pointer;
  color: #1482f0 !important;
}
</style>
