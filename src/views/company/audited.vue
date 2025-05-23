<template>
  <div class="app-container">
    <!-- 表单输入框 -->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="公司名称">
        <el-input v-model="name" placeholder="公司名称" clearable />
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
      <el-table-column label="公司名称" width="300" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="公司Logo" width="110" align="center">
        <template slot-scope="scope">
          <el-image :src="scope.row.logo" fit="contain" />
        </template>
      </el-table-column>
      <el-table-column label="公司地址" width="500" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="252">
        <template slot-scope="scope">
          <span>
            <el-button type="primary" size="mini" plain @click="visibleDialog(scope.row.id)">查看</el-button>
            <el-button type="success" size="mini" plain @click="handeleAuditCompany(scope.row.id,1)">通过</el-button>
            <el-button type="danger" size="mini" plain @click="handeleAuditCompany(scope.row.id,2)">不通过</el-button>
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
      title="公司详情"
      :visible.sync="centerDialogVisible"
      width="40%"
      height="70vh"
      center
    >
      <div class="company_title_style">
        <el-image
          style="width: 100px; height: 100px"
          :src="company.logo"
          :preview-src-list="[company.logo]"
        />
        <span class="company_name_style">{{ company.name }}</span>
      </div>
      <div>
        <div class="label_style">公司状态</div>
        <el-tag v-if="company.status === 0">待审核</el-tag>
        <el-tag v-else-if="company.status === 1" type="success">通过</el-tag>
        <el-tag v-else-if="company.status === 2" type="danger">不通过</el-tag>
      </div>
      <div>
        <div class="label_style">公司简介</div>
        <div class="content_style">{{ company.intro }}</div>
      </div>
      <div>
        <div class="label_style">公司地址</div>
        <div class="content_style">
          <i class="el-icon-location-outline" />
          <span>
            {{ company.address }}
          </span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" plain @click="centerDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { pageCompanies, auditCompany, singleCompany } from '@/api/company'
import { showConfirmDialog } from '@/utils/confirmService'

export default {
  data() {
    return {
      pageData: {},
      listLoading: true,
      pageNum: 1,
      pageSize: 20,
      name: '',
      centerDialogVisible: false,
      company: {}
    }
  },
  created() {
    this.fetchData(this.pageNum, this.pageSize, this.name)
  },
  methods: {
    async fetchData(pageNum, pageSize, name) {
      this.listLoading = true
      const response = await pageCompanies({ pageNum: pageNum, pageSize: pageSize, status: 0, name: name })
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
    handeleAuditCompany(id, status) {
      if (status === 1) {
        this.checkCompany(id, status)
      } else if (status === 2) {
        showConfirmDialog('此操作不可恢复, 是否继续?')
          .then(() => {
          // 用户点击了确定
            this.checkCompany(id, status)
          })
          .catch(() => {
          // 用户点击了取消
          })
      }
    },
    checkCompany(id, status) {
      auditCompany(id, status).then(response => {
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
      this.fetchData(this.pageNum, val, this.name)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.fetchData(val, this.pageSize, this.name)
    },
    onSubmit() {
      console.log('submit!')
      this.fetchData(this.pageNum, this.pageSize, this.name)
    },
    visibleDialog(id) {
      this.centerDialogVisible = true
      singleCompany({ id: id }).then(res => {
        if (res.code) {
          this.company = res.data
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
  .company_title_style{
    display: flex;
    align-items: center;
  }
  .company_name_style{
    font-size: 30px;
    margin-left: 1vw;
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
