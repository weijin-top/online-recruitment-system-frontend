<template>
  <div class="container">
    <!-- 岗位信息 -->
    <div class="position-container">
      <!-- 左边信息 -->
      <div>
        <div style="font-size: 12px; color:#666;">
          <i class="el-icon-time" style="margin-right: 5px;" />
          <span>职位发布于 {{ formatDateTime(positionDetail.createTime) }}</span>
        </div>
        <div class="position-name">{{ positionDetail.name }}</div>
        <div class="salary-style">{{ positionDetail.miniSalary / 1000 }}-{{ positionDetail.maxSalary / 1000 }}K</div>
        <div class="position-require-info">
          <span>{{ positionDetail.jobPlace }}</span>
          <span><education-map :education="positionDetail.education" /></span>
          <span>招{{ positionDetail.number }}人</span>
        </div>
      </div>
      <!-- 右边按钮 -->
      <div><el-button
        type="primary"
        class="btn-style"
        :disabled="positionDetail.rdId !== null"
        @click="handleDelivery(positionDetail.id)"
      >{{ positionDetail.rdId !== null ? '已投递':'投递职位' }}</el-button></div>
    </div>
    <!-- 岗位要求/公司信息 -->
    <div class="between-contianer">
      <!-- 岗位信息 -->
      <div class="left-container" style=" width: 50%;">
        <div class="vertical-center font-15"><span style="margin-right: 30px;">职位描述</span> <el-divider /></div>
        <div class="font-15">职位类别</div>
        <div>{{ positionDetail.postName }}</div>
        <div class="font-15">任职要求:</div>
        <div class="intro-container" style="font-size: 15px;">
          {{ positionDetail.jobRequire }}
        </div>
      </div>
      <!-- 公司信息 -->
      <div class="right-container" style="width:50%;">
        <div style="line-height: 49px;" class="font-15">公司信息</div>
        <div><img :src="positionDetail.logo" alt="公司logo" style="width: 100px;"></div>
        <div style="font-size: 18px; font-weight:550;">{{ positionDetail.companyName }}</div>
        <div class="intro-container" style="font-size: 15px;">{{ positionDetail.intro }}</div>
        <div style="font-size: 15px;">
          <i class="el-icon-location-outline" />
          <span>{{ positionDetail.address }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getPositionDetails } from '@/api/position'
import { saveResumeDelivery } from '@/api/resumeDelivery'
import { getUserId } from '@/utils/auth'
import EducationMap from '@/components/Map/educationMap'
export default {
  name: 'MyResume',
  components: { EducationMap },
  data: function() {
    return {
      positionDetail: {},
      currentPositionId: null
    }
  },
  created() {
    this.currentPositionId = this.$route.query.id
    this.queryPositionDetialById(this.currentPositionId)
  },
  methods: {
    handleDelivery(positionId) {
      saveResumeDelivery(positionId).then(res => {
        const success = this.handleResult(res)
        if (success) {
          const jsonMsg = { receiverId: this.positionDetail.userId,
            content: `您好，看到您发布的【${this.positionDetail.name}】职位信息，我很感兴趣，希望可以进一步沟通`,
            senderId: getUserId() }
          // websocket发送信息
          this.$sendMessage(jsonMsg)
        }
      })
    },
    queryPositionDetialById(id) {
      getPositionDetails(id).then(res => {
        if (res.code) {
          this.positionDetail = res.data
        } else {
          this.$message({ type: 'error', message: res.msg })
        }
      })
    },
    handleResult(res) {
      if (res.code) {
        this.$message({
          type: 'success',
          message: res.msg
        })
        this.queryPositionDetialById(this.currentPositionId)
        return true
      } else {
        this.$message({
          type: 'error',
          message: res.msg
        })
        return false
      }
    },
    formatDateTime(dateString) {
      const date = new Date(dateString)

      // 提取年、月、日、时、分
      const year = date.getFullYear()
      const month = this.padZero(date.getMonth() + 1) // 月份从 0 开始，所以需要 +1
      const day = this.padZero(date.getDate())
      const hours = this.padZero(date.getHours())
      const minutes = this.padZero(date.getMinutes())

      // 格式化输出
      const formattedDate = `${year}年${month}月${day}日 ${hours}时${minutes}分`

      return formattedDate
    },
    padZero(num, size = 2) {
      return num.toString().padStart(size, '0')
    },
    // 获取当前时间
    getCurrentTime() {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const secends = String(now.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${secends}`
    }
  }
}
</script>

<style scoped>
.container{
  background-color: rgb(255,255,255);
   height: 100vh;
   width: 1200px;
   margin: 0 auto;
   margin-top: 1em;
   padding: 1em;
}
.position-container{
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding-bottom: 30px;
}
.position-name{
  font-size: 30px;
  font-weight: 700;
}
.salary-style{
  color: rgb(66,110,255);
  font-size: 25px;
}
.position-require-info>span{
  margin-right: 15px;
  padding-right: 15px;
  border-right: 1px solid rgba(140, 138, 138, 0.529);
}
.position-require-info > span:last-child {
  border-right: none;
}
::v-deep .el-divider{
  width: 400px;
}
.vertical-center{
  display: flex;
  align-items: center;
}
.between-contianer{
  display: flex;
}
.right-container{
  margin-left: 25px;
}
.right-container>div,.left-container>div{
  margin-bottom: 20px;
}
.intro-container{
  line-height: 26px;
}
.position-container>div>div{
  margin-bottom: 8px;
}
.btn-style{
  width: 200px;
  height:50px;
  font-weight: 500;
  font-size: 18px;
}
.font-15{
  font-size: 15px;
  color: #666666;
}
</style>
