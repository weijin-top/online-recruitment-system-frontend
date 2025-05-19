<template>
  <div class="container">
    <div id="resume-content" class="resume-container">
      <!-- 个人基本信息 -->
      <div class="flex-between">
        <!-- 文字信息 -->
        <div class="info-box-text parent-container">
          <el-row :gutter="20" style="margin-bottom: 30px;" class="flex-vertical-center">
            <el-col :span="12"><span class="title-font" style="font-size: 30px"> {{ resume.name }} </span></el-col>
            <el-col :span="12"><span class="title-font">意向岗位:</span><span class="title-font"> {{ resume.postName }} </span></el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8"><span class="title-font">性别:</span><span class="content-font"> <span v-if="resume.gender === 1">男 </span><span v-else-if="resume.gender === 2">女</span>  </span></el-col>
            <el-col :span="8"><span class="title-font">年龄:</span><span class="content-font">{{ resume.age }}</span></el-col>
            <el-col :span="8"><span class="title-font">电话:</span><span class="content-font">{{ resume.phone }}</span></el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12"><span class="title-font">现所在地:</span><span class="content-font">{{ resume.address }}</span></el-col>
            <el-col :span="12"><span class="title-font">邮箱:</span><span class="content-font">{{ resume.email }}</span></el-col>
          </el-row>
        </div>
        <!-- 照片 -->
        <div>
          <img
            id="avatar"
            style="width: 100px;"
            :src="resume.avatar"
            :fit="fit"
          >
        </div>
      </div>
      <!-- 分隔线 -->
      <div v-if="resume.educationVOS.length !== 0" class="divider-box">
        <div class="circle-box" />
        <div class="divider-text-box">教育经历</div>
        <div class="oval-box" />
        <div class="divider" />
        <div> <i class="el-icon-s-order icon-style" style=" color: rgb(37,62,98); font-size: 24px;" /></div>
      </div>
      <!-- 教育经历 -->
      <div v-for="item in resume.educationVOS" :key="'deucation'+item.id" class="parent-container">
        <div class="flex-between">
          <div class="font-color-black">{{ formatDate(item.startTime) }}-{{ formatDate(item.endTime) }}</div>
          <div class="font-color-black"> {{ item.schoolName }} </div>
        </div>
        <div class="content-font">{{ item.major }} | {{ getEducationName(item.level) }}</div>
        <div>
          <span class="title-font">校园经历:</span>
          <span class="content-font description-line-height"> {{ item.description }} </span>
        </div>
      </div>
      <!-- 分隔线 -->
      <div v-if="resume.skill !== '' || resume.skill != undefined || resume.skill !== null" class="divider-box">
        <div class="circle-box" />
        <div class="divider-text-box">专业技能</div>
        <div class="oval-box" />
        <div class="divider" />
        <div> <i class="el-icon-s-order icon-style" style=" color: rgb(37,62,98); font-size: 24px;" /></div>
      </div>
      <!-- 专业技能 -->
      <div class="parent-container description-line-height content-font">
        {{ resume.skill }}
      </div>
      <!-- 分隔线 -->
      <div v-if="resume.jobVOS.length !== 0" class="divider-box">
        <div class="circle-box" />
        <div class="divider-text-box">工作经历</div>
        <div class="oval-box" />
        <div class="divider" />
        <div> <i class="el-icon-s-order icon-style" style=" color: rgb(37,62,98); font-size: 24px;" /></div>
      </div>
      <!-- 工作经历 -->
      <div v-for="item in resume.jobVOS" :key="'job'+item.id" class="parent-container">
        <div class="flex-between">
          <div class="font-color-black">{{ formatDate(item.startTime) }}-{{ formatDate(item.endTime) }}</div>
          <div class="font-color-black">{{ item.companyName }}</div>
          <div class="font-color-black">{{ item.position }}</div>
        </div>
        <div>
          <span class="title-font">工作描述:</span>
          <span class="content-font description-line-height"> {{ item.content }} </span>
        </div>
      </div>
      <!-- 分隔线 -->
      <div v-if="resume.projectVOS.length !== 0" class="divider-box">
        <div class="circle-box" />
        <div class="divider-text-box">项目经历</div>
        <div class="oval-box" />
        <div class="divider" />
        <div> <i class="el-icon-s-order icon-style" style=" color: rgb(37,62,98); font-size: 24px;" /></div>
      </div>
      <!-- 项目经历 -->
      <div v-for="item in resume.projectVOS" :key="'project'+item.id" class="parent-container">
        <div class="flex-between">
          <div class="font-color-black">{{ formatDate(item.startTime) }}-{{ formatDate(item.endTime) }}</div>
          <div class="font-color-black">{{ item.projectName }}</div>
          <!-- <div class="font-color-black">java后端开发</div> -->
        </div>
        <div>
          <span class="title-font">项目描述:</span>
          <span class="content-font description-line-height"> {{ item.content }} </span>
        </div>
      </div>
      <!-- 分隔线 -->
      <div v-if="resume.summary !== '' || resume.summary != undefined || resume.summary !== null" class="divider-box">
        <div class="circle-box" />
        <div class="divider-text-box">个人总结</div>
        <div class="oval-box" />
        <div class="divider" />
        <div> <i class="el-icon-s-order icon-style" style=" color: rgb(37,62,98); font-size: 24px;" /></div>
      </div>
      <!-- 个人总结 -->
      <div class="parent-container description-line-height content-font">
        {{ resume.summary }}
      </div>
    </div>
    <!-- 导出按钮 -->
    <div class="btn-goup-box">
      <el-button v-if="isShowExportBtn" type="primary" @click="exportToPdf()">导出简历</el-button>
      <el-button v-if="isShowInterviewBtn" type="success" @click="dialogFormVisible = true">邀约面试</el-button>
      <el-button v-if="isShowInterestedBtn" type="warning" @click="clickInsertedBtn()">感兴趣</el-button>
      <el-button v-if="isShowReturnBtn" type="danger" @click="clickReturnBtn()">返回</el-button>
    </div>
    <!-- 邀约面试弹出框 -->
    <el-dialog title="邀约面试" :visible.sync="dialogFormVisible">
      <el-form
        ref="form"
        :label-position="labelPosition"
        label-width="80px"
        :model="form"
        :rules="rules"
        :hide-required-asterisk="true"
      >
        <el-form-item label="面试时间" prop="time">
          <el-date-picker
            v-model="form.time"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="面试地点" prop="address">
          <el-input v-model="form.address" clearable />
        </el-form-item>
        <el-form-item label="备注" prop="interviewRemark">
          <el-input v-model="form.interviewRemark" clearable type="textarea" resize="none" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="clickInviteInterviewBtn()">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
import { queryResume } from '@/api/info'
import { modifyResumeDeliveryStatus } from '@/api/resumeDelivery'
import htmlToPdf from '@/utils/htmlToPdf'
import { getUserId } from '@/utils/auth'
import { saveInterview } from '@/api/interview'

export default {
  name: 'ResumePreview',
  props: {
    userId: {
      default: parseInt(getUserId()), // 默认是求职者获取自己的简历，传参就是招聘者获取求职者的简历
      type: Number
    },
    resumeDeliveryId: {
      default: null,
      type: Number
    },
    isShowReturnBtn: {
      default: false,
      type: Boolean
    },
    isShowInterviewBtn: {
      default: false,
      type: Boolean
    },
    isShowInterestedBtn: {
      default: false,
      type: Boolean
    },
    isShowExportBtn: {
      default: true,
      type: Boolean
    }
  },
  // components: { EduSelector },
  data: function() {
    return {
      educationMap: new Map([
        [1, '小学'],
        [2, '初中'],
        [3, '高中'],
        [4, '大专'],
        [5, '本科'],
        [6, '硕士'],
        [7, '博士']
      ]),
      resume: {
        educationVOS: [],
        jobVOS: [],
        projectVOS: []
      },
      fit: 'contain',
      dialogFormVisible: false,
      labelPosition: 'right',
      form: {
        rdId: null,
        userId: null,
        time: null,
        address: null,
        interviewRemark: null
      },
      rules: {
        address: [
          { required: true, message: '请输入面试地点', trigger: 'blur' }
        ],
        time: [
          { required: true, message: '请选择面试时间', trigger: 'change' }
        ],
        interviewRemark: [
          { required: true, message: '请输入备注', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getResume()
  },
  beforeDestroy() {
    // this.userId = null
  },
  methods: {
    exportToPdf() {
      htmlToPdf.getPdf(`${this.resume.name}-${this.resume.postName}`, this.resume.avatar)
    },
    getResume() {
      queryResume(this.userId).then(res => {
        if (res.code) {
          this.resume = res.data
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
      }).catch(error => {
        console.error('修改失败:', error)
      })
    },
    formatDate(date) {
      return date.replace('-', '.')
    },
    getEducationName(educationLevel) {
      // 检查输入是否合法
      if (!Number.isInteger(educationLevel)) {
        throw new Error('教育水平必须是一个整数')
      }
      // 获取对应的学历名称
      const educationName = this.educationMap.get(educationLevel)
      // 如果找不到对应的学历名称，返回一个默认值或抛出异常
      if (educationName === undefined) {
        throw new Error('无效的教育水平')
      }
      return educationName
    },
    clickInsertedBtn() {
      if (this.resumeDeliveryId === null) {
        return
      }
      modifyResumeDeliveryStatus(this.resumeDeliveryId, 2).then(res => {
        if (res.code) {
          this.$message({
            type: 'success',
            message: res.msg
          })
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
      })
    },
    clickReturnBtn() {
      // 点击返回按钮，向父组件发送false关闭窗口
      this.$emit('data-updated', false)
    },
    clickInviteInterviewBtn() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          console.log('error submit!!')
          return false
        }
        this.form.userId = this.userId
        this.form.rdId = this.resumeDeliveryId
        saveInterview(this.form).then(res => {
          if (res.code) {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.$emit('data-updated', false)
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        })
      })
    }
  }
}
</script>

<style scoped>
[v-cloak]{
  display: none;
}
.container{
    margin-top: 1em;
    display: flex;
    width: 100% !important;
}

.resume-container{
    width: 210mm;  /* A4纸的宽度 */
    height: 297mm; /* A4纸的高度 */
    margin: 0 auto; /* 居中对齐 */
    padding: 15mm; /* 添加内边距以模拟页边距 */
    background-color: #fff; /* 白色背景 */
    position: relative; /* 使内部元素可以绝对定位 */
    box-sizing: border-box; /* 边界盒模型 */
    box-shadow: 0 0 10px 5px rgba(106, 106, 106, 0.5); /* 四周都有阴影 */
    border-radius: 15px;
}
.parent-container > *{
  margin-bottom: 10px;
}
.title-font{
    font-weight: 700;
    color: rgb(106,106,106);
    margin-right: 10px;
}
.content-font{
    color: rgb(107,107,107);
}
.flex-between{
  display: flex;
  justify-content: space-between;
}
.info-box-text{
  flex: 2;
  margin-right: 30px;
}
.flex-vertical-center{
  display: flex;
  align-items: center;
}
.divider-box{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.circle-box{
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: rgb(37,62,98);
}
.divider{
  height: 2px;
  width: 60%;
  background-color: rgb(175, 174, 174);
}
.oval-box{
  width: 50px;
  height: 14px;
  border-radius: 7px;
  background-color: rgb(37,62,98);
}
.divider-text-box{
  font-weight: 700;
  font-size: 18px;
  color: rgb(106,106,106);
}
.el-icon-price-tag .icon-style{
  color: rgb(37, 62, 98) !important;
  font-size: 18px !important;
}
.resume-container>div{
  margin-bottom: 20px;
}
.font-color-black{
  color: black;
  font-weight: 700;
}
.description-line-height{
  line-height: 26px;
}
.btn-goup-box{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-right: 0px;
}
.btn-goup-box > button{
  margin: 0 0 10px 0;
  width: 100px;
}
::v-deep .el-textarea__inner{
  height: 80px;
}
</style>
