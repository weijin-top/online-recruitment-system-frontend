<!--
 * @Author: 魏进 3413105907@qq.com
 * @Date: 2024-08-23 17:02:07
 * @LastEditors: 魏进 3413105907@qq.com
 * @LastEditTime: 2025-03-24 10:26:10
 * @FilePath: \online-recruitment-system-frontend\src\views\positionManagerment\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="app-container">
    <!-- 表单输入框 -->
    <el-form v-model="params" :inline="true" class="demo-form-inline">
      <el-form-item label="职位名称">
        <el-input v-model="params.name" placeholder="请输入职位名称" clearable />
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
      <el-form-item label="职位状态" prop="education">
        <position-status-selector
          v-model="params.status"
          style="margin-bottom: 10px"
          @change="handleStatusChange"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="toPublishPage">发布职位</el-button>
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
      <el-table-column label="薪资" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.miniSalary / 1000 }}-{{ scope.row.maxSalary / 1000 }}K
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
      <el-table-column label="职位状态" width="150" align="center">
        <template slot-scope="scope">
          <position-status-map :status="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="252">
        <template slot-scope="scope">
          <span>
            <el-button
              type="primary"
              size="mini"
              plain
              :disabled="scope.row.status === 3"
              @click="toPublishPage(scope.row.id)"
            >修改</el-button>
            <el-button
              type="danger"
              size="mini"
              plain
              :disabled="scope.row.status !== 1"
              @click="stopRecruit(scope.row.id)"
            >停止招聘</el-button>
            <!-- <el-button type="success" size="mini" plain @click="audit(scope.row.id,1)">通过</el-button>
              <el-button type="danger" size="mini" plain @click="audit(scope.row.id,2)">不通过</el-button> -->
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
import EduSelector from '@/components/Selector/eduSelector'
import PostSelector from '@/components/Selector/postSelector'
import PositionStatusSelector from '@/components/Selector/positionStatusSelector'
import EducationMap from '@/components/Map/educationMap'
import PositionStatusMap from '@/components/Map/positionStatusMap'
import { pagingPosition, getPositionDetails, /* auditPosition,*/ cancelPosition } from '@/api/position'
import { showConfirmDialog } from '@/utils/confirmService'

export default {
  components: { EduSelector, PostSelector, PositionStatusSelector, EducationMap, PositionStatusMap },
  data() {
    return {
      params: {
        pageNum: 1,
        pageSize: 20,
        name: '',
        edu: '',
        type: '',
        status: null
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
    toPublishPage(id) {
      this.$router.push({ name: 'PublishPosition', query: { id: id, title: '修改职位' }})
    },

    handleStatusChange(value) {
      console.log('职位状态变化:', value)
    },
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
    stopRecruit(id) {
      showConfirmDialog('此操作不可恢复, 是否继续?')
        .then(() => {
          // 用户点击了确定
          cancelPosition(id).then(res => {
            if (res.code) {
              this.$message({
                type: 'success',
                message: res.msg
              })
              this.fetchData()
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              })
            }
          })
        })
        .catch(() => {
          // 用户点击了取消
        })
    },
    // audit(id, status) {
    //   auditPosition(id, status).then(response => {
    //     if (response.code) {
    //       this.$message({
    //         type: 'success',
    //         message: response.msg
    //       })
    //       this.fetchData()
    //     } else {
    //       this.$message({
    //         type: 'error',
    //         message: response.msg
    //       })
    //     }
    //   }
    //   )
    // },
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
