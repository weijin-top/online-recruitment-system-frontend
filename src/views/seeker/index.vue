<template>
  <div class="container">
    <!--搜索框-->
    <div class="serach-container">
      <post-selector v-model.number="params.type" />
      <el-input v-model="params.name" placeholder="请输入职位或公司名称" class="input-with-select" style="width: 35em;">
        <!-- <post-selector v-model.number="params.type" slot="prepend" style="width: 30em;"/> -->
        <el-button slot="append" icon="el-icon-search" type="primary" style="width: 5em;" @click="handleserach" />
      </el-input>
    </div>
    <!--调第3n-1个元素的样式-->
    <div class="position-container">
      <!-- 职位 -->
      <div v-for="item in pageData.records" :key="item.id" class="item-container" @click="toPositionDetail(item.id)">
        <div class="margin-between">
          <div style="font-size: 20px;"> {{ item.name }} </div>
          <div style="color: red; width:70px; text-align: right;">{{ item.miniSalary / 1000 }}-{{ item.maxSalary / 1000 }}K</div>
        </div>
        <div class="flex-container">
          <div>{{ item.jobPlace }}</div>
          <education-map :education="item.education" />
          <!-- <div>学历</div> -->
        </div>
        <div class="margin-between">
          <div class="flex-container">
            <div>
              <img :src="item.logo" class="logo-img">
            </div>
            <div>{{ item.companyNickname }}</div>
          </div>
          <div>{{ item.postName }}</div>
        </div>
      </div>
    </div>
    <!-- 分页器 -->
    <div class="block">
      <el-pagination
        :current-page="pageData.current"
        :page-sizes="[18, 30, 42, 60]"
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
import PostSelector from '@/components/Selector/postSelector'
import { pagingPosition } from '@/api/position'

export default {
  name: 'SeekerIndex',
  components: { EducationMap, PostSelector },
  data: function() {
    return {
      pageData: {},
      params: {
        pageNum: 1,
        pageSize: 18,
        name: '',
        edu: '',
        type: '',
        status: 1,
        orderBy: 1
      }

    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.listLoading = true
      const response = await pagingPosition(this.params)
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
      this.params.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.params.pageNum = val
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
.position-container{
    display: flex;
    flex-wrap: wrap;
    /*justify-content: center;*/
}

.item-container:nth-child(3n - 1){
    margin: 0 3em 1em 3em;
}
.margin-between{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.item-container{
    background-color: rgb(255,255,255);
    padding: 1em;
    border-radius: 1em;
    margin-bottom: 1em;
    width: 30%;
   /* margin: 0 1em 1em 0;*/
   cursor: pointer;
}
.item-container > div{
    margin-bottom: 1em;
}
.item-container > div:last-child{
    margin-bottom: 0;
}
.flex-container{
    display: flex;
    align-items: center;
}
.flex-container>div:first-child{
    margin-right: 1em;
}
.logo-img{
    width: 3em;
   /* border-radius: 50%;*/
}
.block{
    display: flex;
    justify-content: center; /* 水平居中 */
    margin-top: 1em;
}
.serach-container{
  margin: 2em 0 3em 0;
  display: flex;
  justify-content: center;
}
</style>
