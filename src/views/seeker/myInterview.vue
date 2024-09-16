<template>
  <div class="container">
    <!-- 表单输入框 -->
    <!-- <el-form v-model="params" :inline="true" class="demo-form-inline">
      <el-form-item label="公司/职位名称">
        <el-input v-model="params.name" placeholder="请输入公司/职位名称" clearable />
      </el-form-item>
      <el-form-item label="职位类型" prop="type">
        <post-selector v-model.number="params.type" @selectedChange="handlePostChange" />
      </el-form-item>
      <el-form-item label="学历要求" prop="education">
        <edu-selector
          v-model="params.edu"
          style="margin-bottom: 10px"
          @change="handleEduChangeSingle"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form> -->
    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="pageData.records"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="职位名称" width="250" align="center">
        <template slot-scope="scope">
          {{ scope.row.positionName }}
        </template>
      </el-table-column>
      <el-table-column label="公司名称" width="300" align="center">
        <template slot-scope="scope">
          {{ scope.row.companyNickname }}
        </template>
      </el-table-column>
      <el-table-column label="工作地点" width="210" align="center">
        <template slot-scope="scope">
          {{ scope.row.jobPlace }}
        </template>
      </el-table-column>
      <el-table-column label="面试结果" width="150" align="center">
        <template slot-scope="scope">
          <interview-result-map :status="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="150">
        <template slot-scope="scope">
          <span>
            <el-button type="primary" size="mini" plain @click="visibleDialog(scope.row.id)">查看</el-button>
            <!-- <el-button type="success" size="mini" plain @click="auditPosition(scope.row.id,1)">通过</el-button>
            <el-button type="danger" size="mini" plain @click="auditPosition(scope.row.id,2)">不通过</el-button> -->
          </span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block">
      <el-pagination
        :current-page="pageData.current"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageData.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageData.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 弹出框 -->
    <el-dialog
      title="面试进度"
      :visible.sync="centerDialogVisible"
      width="40%"
      height="70vh"
      center
    >
      <el-steps :active="active" finish-status="success">
        <el-step title="进入面试" />
        <el-step title="面试中" />
        <el-step title="面试结果" />
      </el-steps>
      <!-- 面试中 -->
      <div v-if="active === 2" class="interviewing-box">
        <div><span class="lable-box">时间:</span><span class="content-box">{{ formatDataTime(schedule.time) }}</span></div>
        <div><span class="lable-box">地点:</span><span class="content-box">{{ schedule.address }}</span></div>
        <div><span class="lable-box">备注:</span><span class="content-box">{{ schedule.interviewRemark }}</span></div>
      </div>
      <!-- 面试结果 -->
      <div v-else-if="active === 3">
        <div><span class="lable-box">备注:</span><span class="content-box">{{ schedule.resultRemark }}</span></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import InterviewResultMap from '@/components/Map/interviewResultMap'
import { pageInterview, getSchedule } from '@/api/interview'

export default {
  name: 'WaitInterview',
  components: { InterviewResultMap },
  data() {
    return {
      params: {
        pageNum: 1,
        pageSize: 20
      },
      pageData: {},
      listLoading: true,
      centerDialogVisible: false,
      active: 1,
      schedule: {}
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    formatDataTime(datetime) {
      var newDateTime = datetime.replace('T', ' ')
      return newDateTime.substring(0, 16)
    },
    async fetchData() {
      this.listLoading = true
      const response = await pageInterview(this.params)
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
    onSubmit() {
      console.log('submit!')
      this.fetchData()
    },
    visibleDialog(id) {
      this.centerDialogVisible = true
      getSchedule(id).then(res => {
        if (res.code) {
          this.schedule = res.data
          if (this.schedule.status === 0) {
            this.active = 2
          } else {
            this.active = 3
          }
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
      })
    }
  }
}
</script>

<style scoped>
  .container{
    width: 1200px;
    margin: 0 auto;
    margin-top: 1em;
  }
  .block{
    margin-top: 2vh;
  }
  ::v-deep .el-dialog__body{
    height: 32vh !important;
  }
  ::v-deep .dialog-footer{
    display: flex;
    justify-content: flex-end;
  }
  ::v-deep .el-dialog {
    border-radius: 10px;
  }
  .interviewing-box{
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
  .interviewing-box > div{
    margin-bottom: 20px;
  }
  ::v-deep .el-steps{
    display: flex;
    justify-content: center;
    margin-bottom: 40px;
  }
  .lable-box{
    font-size: 18px;
    color: black;
    margin-right: 20px;
  }
  .content-box{
    font-size: 16px;
    line-height: 30px;
  }
</style>
