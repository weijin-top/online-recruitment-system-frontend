<template>
  <div class="app-container">
    <!-- 表单输入框 -->
    <el-form v-model="params" :inline="true" class="demo-form-inline">
      <el-form-item label="用户名">
        <el-input v-model="params.username" placeholder="请输入用户名" clearable />
      </el-form-item>
      <el-form-item label="角色" prop="roleId">
        <el-select v-model="params.roleId" clearable placeholder="请选择角色">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
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
      <el-table-column  width="100" align="center" label="序号">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="密码" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.password }}
        </template>
      </el-table-column>
      <el-table-column label="角色" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.roleId === 1 ? '求职者' : '招聘者' }}
        </template>
      </el-table-column>
      <el-table-column label="头像"  align="center">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" style="width: 60px">
        </template>
      </el-table-column>
      <el-table-column label="注册时间" width="220" align="center">
        <template slot-scope="scope">
          {{ scope.row.createTime.replace('T',' ') }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="150">
        <template slot-scope="scope">
          <span>
            <el-button type="primary" size="mini" plain @click="doResetPassword(scope.row.id)">重置密码</el-button>
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
  </div>
</template>

<script>
import { pageUser, resetPassword } from '@/api/user'

export default {
  data() {
    return {
      params: {
        pageNum: 1,
        pageSize: 10,
        username: '',
        roleId: null
      },
      options: [
        {
          label: '求职者',
          value: 1
        },
        {
          label: '招聘者',
          value: 2
        }
      ],
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
    async fetchData() {
      this.listLoading = true
      const response = await pageUser(this.params)
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
    doResetPassword(id){
      this.$confirm('此操作将永久重置改用户密码,不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resetPassword(id).then(res=>{
          if (res.code){
            this.$message({type:'success',message:res.msg})
          }else {
            this.$message({type:'error',message:res.msg})
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消重置密码'
        })
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
