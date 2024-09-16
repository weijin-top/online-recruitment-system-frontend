<template>
  <div class="app-container">
    <!-- 控制是否显示表格信息 -->
    <div v-show="!centerDialogVisible">

      <!-- 表单输入框 -->
      <el-form v-model="params" :inline="true" class="demo-form-inline">
        <el-form-item label="职位名称">
          <el-input v-model="params.positionName" placeholder="请输入职位名称" clearable />
        </el-form-item>
        <el-form-item label="学历要求" prop="education">
          <edu-selector
            v-model="params.education"
            style="margin-bottom: 10px"
            @change="handleEduChangeSingle"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
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
        <el-table-column label="姓名" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="应聘职位" width="200" align="center">
          <template slot-scope="scope">
            {{ scope.row.positionName }}
          </template>
        </el-table-column>
        <el-table-column label="手机号" width="150" align="center">
          <template slot-scope="scope">
            {{ scope.row.phone }}
          </template>
        </el-table-column>
        <el-table-column label="邮箱" width="210" align="center">
          <template slot-scope="scope">
            {{ scope.row.email }}
          </template>
        </el-table-column>
        <el-table-column label="现居地" width="210" align="center">
          <template slot-scope="scope">
            {{ scope.row.address }}
          </template>
        </el-table-column>
        <el-table-column label="学历" width="80" align="center">
          <template slot-scope="scope">
            <education-map :education="scope.row.education" />
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template slot-scope="scope">
            <delivery-status-map :status="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="created_at" label="操作" width="100">
          <template slot-scope="scope">
            <span>
              <el-button type="primary" size="mini" plain @click="visibleDialog(scope.row.userId,scope.row.id)">查看</el-button>
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
    </div>
    <!-- 弹出框 -->
    <div v-if="centerDialogVisible" class="resume-box">
      <resume-preview
        :user-id="currentLookUserId"
        :is-show-return-btn="true"
        @data-updated="handleDataUpdated"
      />
    </div>
    <!-- </el-dialog> -->
  </div>
</template>

<script>
import EduSelector from '@/components/Selector/eduSelector'
import EducationMap from '@/components/Map/educationMap'
import ResumePreview from '@/views/seeker/resumeComponents/resumePreview'
import deliveryStatusMap from '@/components/Map/deliveryStatusMap'
import { pageDelivery } from '@/api/resumeDelivery'

export default {
  name: 'Interested',
  components: { EduSelector, EducationMap, ResumePreview, deliveryStatusMap },
  data() {
    return {
      params: {
        pageNum: 1,
        pageSize: 20,
        positionName: '',
        education: '',
        status: 2
      },
      pageData: {},
      listLoading: true,
      centerDialogVisible: false,
      position: {},
      currentLookUserId: null
      // currentLookResumeDeliveryId: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    handleEduChangeSingle(value) {
      console.log('学历要求变化:', value)
      // 这里可以进一步处理repo对象，比如更新UI或发送网络请求等
    },
    handlePostChange(value) {
      console.log('职位类型变化:', value)
    },
    async fetchData() {
      this.listLoading = true
      const response = await pageDelivery(this.params)
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
    visibleDialog(userId, resumeDeliveryId) {
      this.currentLookUserId = userId
      // this.currentLookResumeDeliveryId = resumeDeliveryId
      this.centerDialogVisible = true
    },
    handleDataUpdated(data) {
      this.currentLookUserId = null
      // this.currentLookResumeDeliveryId = null
      this.centerDialogVisible = data
    }
  }
}
</script>

<style scoped>
  .block{
    margin-top: 2vh;
  }
</style>
