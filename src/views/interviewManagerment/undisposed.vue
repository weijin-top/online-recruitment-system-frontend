<template>
  <div class="app-container">
    <!-- 控制是否显示表格信息 -->
    <div>

      <!-- 表单输入框 -->
      <!-- <el-form v-model="params" :inline="true" class="demo-form-inline">
        <el-form-item label="职位名称">
          <el-input v-model="params.positionName" placeholder="请输入职位名称" clearable />
        </el-form-item>
        <el-form-item label="面试结果" prop="education">
          <pass-selector
            v-model="params.status"
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
        <el-table-column label="姓名" width="150" align="center">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="应聘职位" width="250" align="center">
          <template slot-scope="scope">
            {{ scope.row.positionName }}
          </template>
        </el-table-column>
        <el-table-column label="手机号" width="200" align="center">
          <template slot-scope="scope">
            {{ scope.row.phone }}
          </template>
        </el-table-column>
        <el-table-column label="邮箱" width="200" align="center">
          <template slot-scope="scope">
            {{ scope.row.email }}
          </template>
        </el-table-column>
        <el-table-column label="面试结果" width="100" align="center">
          <template slot-scope="scope">
            <interview-result-map :status="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="created_at" label="操作" width="252">
          <template slot-scope="scope">
            <span>
              <el-button type="primary" size="mini" plain @click="visibleDialog(scope.row.id)">通知面试结果</el-button>
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
    <el-dialog title="通知面试结果" :visible.sync="dialogFormVisible">
      <el-form
        ref="result"
        :model="result"
        :rules="rules"
        :label-position="labelPosition"
        :hide-required-asterisk="true"
        label-width="80px"
      >
        <el-form-item label="面试结果" prop="status">
          <el-radio-group v-model="result.status">
            <el-radio :label="1">通过</el-radio>
            <el-radio :label="2">未通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="resultRemark">
          <el-input v-model="result.resultRemark" clearable type="textarea" resize="none" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="clickSubmitBtn()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import PassSelector from '@/components/Selector/passSelector'
import { pageInterviewResult, /* queryResultDetial,*/ modifyInterview } from '@/api/interview'
import InterviewResultMap from '@/components/Map/interviewResultMap'

export default {
  name: 'Undisposed',
  components: { InterviewResultMap /* PassSelector*/ },
  data() {
    return {
      params: {
        pageNum: 1,
        pageSize: 20,
        positionName: '',
        status: 0
      },
      pageData: {},
      listLoading: true,
      result: {
        id: null,
        status: null,
        resultRemark: null
      },
      dialogFormVisible: false,
      labelPosition: 'right',
      currentInterviewId: null,
      rules: {
        status: [
          { required: true, message: '请选择面试结果', trigger: 'change' }
        ],
        resultRemark: [
          { required: true, message: '请输入备注', trigger: 'blur' }
        ]
      }
      // currentLookResumeDeliveryId: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    clickSubmitBtn() {
      this.$refs.result.validate((valid) => {
        if (!valid) {
          console.log('error submit!!')
          return false
        }
        this.result.id = this.currentInterviewId
        modifyInterview(this.result).then(res => {
          if (res.code) {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.dialogFormVisible = false
            this.currentInterviewId = null
            this.result.id = null
            this.result.status = null
            this.resultRemark = null
            this.fetchData()
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        })
      })
    },
    // getInterviewResultDetail(id) {
    // queryResultDetial(id).then(res => {
    //   if (res.code) {
    //     this.result = res.data
    //   } else {
    //     this.$message({
    //       type: 'error',
    //       message: res.msg
    //     })
    //   }
    // })
    // },
    handleEduChangeSingle(value) {
      console.log('学历要求变化:', value)
      // 这里可以进一步处理repo对象，比如更新UI或发送网络请求等
    },
    handlePostChange(value) {
      console.log('职位类型变化:', value)
    },
    async fetchData() {
      this.listLoading = true
      const response = await pageInterviewResult(this.params)
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
      // this.getInterviewResultDetail(id)
      this.currentInterviewId = id
      this.dialogFormVisible = true
    }
  }
}
</script>

<style scoped>
  .block{
    margin-top: 2vh;
  }
  ::v-deep .el-textarea__inner{
    height: 80px;
  }
</style>
