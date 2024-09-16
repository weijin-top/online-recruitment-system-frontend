<template>
  <div class="app-container">
    <!-- 表单输入框 -->
    <el-form v-model="params" :inline="true" class="demo-form-inline">
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
      <el-table-column label="职位名称" width="250" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="公司名称" width="300" align="center">
        <template slot-scope="scope">
          {{ scope.row.companyName }}
        </template>
      </el-table-column>
      <el-table-column label="职位类别" width="210" align="center">
        <template slot-scope="scope">
          {{ scope.row.postName }}
        </template>
      </el-table-column>
      <el-table-column label="学历要求" width="150" align="center">
        <template slot-scope="scope">
          <education-map :education="scope.row.education" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="252">
        <template slot-scope="scope">
          <span>
            <el-button type="primary" size="mini" plain @click="visibleDialog(scope.row.id)">查看</el-button>
            <el-button type="success" size="mini" plain @click="auditPosition(scope.row.id,1)">通过</el-button>
            <el-button type="danger" size="mini" plain @click="auditPosition(scope.row.id,2)">不通过</el-button>
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
      title="职位详情"
      :visible.sync="centerDialogVisible"
      width="40%"
      height="70vh"
      center
    >
      <div class="company_title_style">
        <span class="position">{{ position.name }}</span>
      </div>

      <div style="margin-top:1em;">
        <span class="label_style" style="margin-right:1em;">职位类别</span>
        <span class="content_style" style="margin-right:1em;">{{ position.postName }}</span>
        <span class="label_style" style="margin-right:1em;">职位状态</span>
        <span style="margin-right:1em;">
          <el-tag v-if="position.status === 0">待审核</el-tag>
          <el-tag v-else-if="position.status === 1" type="success">通过</el-tag>
          <el-tag v-else-if="position.status === 2" type="danger">不通过</el-tag>
        </span>
        <span class="label_style" style="margin-right:1em;">学历要求</span>
        <education-map :education="position.education" />
      </div>
      <div>
        <div class="label_style">公司名称</div>
        <div class="content_style">{{ position.positionName }}</div>
      </div>
      <div>
        <div class="label_style">职位要求</div>
        <div class="content_style">{{ position.jobRequire }}</div>
      </div>
      <div>
        <div class="label_style">工作地址</div>
        <div class="content_style">
          <i class="el-icon-location-outline" />
          <span>
            {{ position.jobPlace }}
          </span>
        </div>
      </div>
      <div>
        <div class="label_style">招聘人数</div>
        <div class="content_style">{{ position.number }} 人</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" plain @click="centerDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import EduSelector from '@/components/Selector/eduSelector'
import PostSelector from '@/components/Selector/postSelector'
import EducationMap from '@/components/Map/educationMap'
import { pagingPosition, getPositionDetails, auditPosition } from '@/api/position'

export default {
  components: { EduSelector, PostSelector, EducationMap },
  data() {
    return {
      params: {
        pageNum: 1,
        pageSize: 20,
        name: '',
        edu: '',
        type: '',
        status: 0
      },
      pageData: {},
      listLoading: true,
      centerDialogVisible: false,
      position: {}
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
    auditPosition(id, status) {
      auditPosition(id, status).then(response => {
        if (response.code) {
          this.$message({
            type: 'success',
            message: response.msg
          })
          this.fetchData(this.pageNum, this.pageSize, this.name)
        } else {
          this.$message({
            type: 'error',
            message: response.msg
          })
        }
      }
      )
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
      getPositionDetails(id).then(res => {
        if (res.code) {
          this.position = res.data
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
  .block{
    margin-top: 2vh;
  }
  ::v-deep .el-dialog__body{
    height: 50vh !important;
  }
  .position_title_style{
    display: flex;
    align-items: center;
  }
  .position{
    font-size: 30px;

  }
  .label_style{
    font-size: 15px;
    color: black;
    margin: 15px 0 10px 0;
  }
  .content_style{
    line-height: 22px;
  }
  ::v-deep .dialog-footer{
    display: flex;
    justify-content: flex-end;
  }
</style>
