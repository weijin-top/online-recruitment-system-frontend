<template>
  <div class="corporation_container">
    <div style="color: #409EFF;">{{ title }}</div>
    <el-divider />
    <el-form
      ref="positionFrom"
      :label-position="labelPosition"
      :rules="rules"
      label-width="80px"
      :hide-required-asterisk="true"
      :model="positionFrom"
      @submit.native.prevent
    >

      <el-form-item label="职位名称" prop="name">
        <el-input v-model="positionFrom.name" clearable placeholder="职位名称" />
      </el-form-item>
      <el-form-item label="职位类型" prop="type">
        <post-selector
          v-model.number="positionFrom.type"
          :post="positionFrom.type"
          :is-enable-auto-init-data="typeof id === 'number'"
          @selectedChange="handlePostChange"
        />
      </el-form-item>
      <el-form-item label="学历要求" prop="education">
        <edu-selector
          v-model="positionFrom.education"
          :education="positionFrom.education"
          style="margin-bottom: 10px"
          @change="handleEduChangeSingle"
        />
      </el-form-item>
      <el-form-item label="招聘人数" prop="number">
        <el-input v-model.number="positionFrom.number" clearable placeholder="招聘人数" />
      </el-form-item>

      <el-form-item label="薪资" prop="salary">
        <el-input v-model.number="positionFrom.miniSalary" style="width: 10em;" clearable placeholder="最低薪资(元)" />
        <span style="margin: 0 1em 22px 1em;">~</span>
        <el-input v-model.number="positionFrom.maxSalary" style="width: 10em; " clearable placeholder="最高薪资(元)" />
      </el-form-item>

      <el-form-item label="工作地点" prop="jobPlace">
        <el-input v-model="positionFrom.jobPlace" clearable placeholder="工作地点" />
      </el-form-item>
      <el-form-item label="任职要求" prop="jobRequire">
        <el-input
          v-model="positionFrom.jobRequire"
          class="el-textarea-style"
          clearable
          resize="none"
          type="textarea"
          placeholder="任职要求"
        />
      </el-form-item>
      <el-form-item v-if="typeof id === 'number' && !isNaN(id)" label="职位状态" prop="jobRequire">
        <position-status-map :status="positionFrom.status" />
      </el-form-item>
    </el-form>
    <el-button type="primary" style="margin-top: 2em;" size="medium" @click="save()">保存</el-button>
  </div>
</template>

<script>
import EduSelector from '@/components/Selector/eduSelector'
import PostSelector from '@/components/Selector/postSelector'
import PositionStatusMap from '@/components/Map/positionStatusMap'
import { savePosition, getPositionById, updatePosition } from '@/api/position'

export default {
  name: 'PublishPosition',
  components: { EduSelector, PostSelector, PositionStatusMap },
  data() {
    const validateSalary = (rule, value, callback) => {
      if (this.positionFrom.miniSalary === '' || this.positionFrom.miniSalary === undefined ||
      this.positionFrom.miniSalary === null) {
        return callback(new Error('请输入最低薪资'))
      }
      if (this.positionFrom.miniSalary < 0) {
        return callback(new Error('最低薪资不能为负数'))
      }
      if (this.positionFrom.maxSalary === '' || this.positionFrom.maxSalary === undefined ||
      this.positionFrom.maxSalary === null) {
        return callback(new Error('请输入最高薪资'))
      }
      if (this.positionFrom.maxSalary <= this.positionFrom.miniSalary) {
        return callback(new Error('最高薪资不能低于或等于最低薪资'))
      }
      callback()
    }

    return {
      id: null,
      labelPosition: 'right',
      title: '发布职位',
      positionFrom: {
        id: '',
        name: '',
        type: null,
        number: '',
        miniSalary: '',
        maxSalary: '',
        jobPlace: '',
        education: '',
        jobRequire: ''
      },
      rules: {
        name: [{ required: true, message: '请输入职位名称', trigger: 'blur' }],
        type: [{ required: true, message: '请输入或选择职位类型', trigger: 'change' }],
        number: [
          { required: true, message: '请输入招聘人数', trigger: 'blur' },
          { type: 'number', message: '招聘人数必须为数字值', trigger: 'blur' }
        ],
        education: [{ required: true, message: '请选择学历要求', trigger: 'change' }],
        salary: [{ validator: validateSalary, trigger: 'blur' }],
        jobPlace: [{ required: true, message: '请输入工作地点', trigger: 'blur' }],
        jobRequire: [{ required: true, message: '请输入任职要求', trigger: 'blur' }]
      }

    }
  },
  created() {
    this.id = this.$route.query.id

    // 尝试将 id 转换为数字
    this.id = Number(this.id)

    // 检查 id 是否为数字
    if (typeof this.id === 'number' && !isNaN(this.id)) {
      this.getPosition(this.id)
      this.title = this.$route.query.title
    } else {
      console.error('Invalid id:', this.id)
    }
  },
  methods: {
    handleEduChangeSingle(value) {
      console.log('学历要求变化:', value)
      // 这里可以进一步处理repo对象，比如更新UI或发送网络请求等
    },
    handlePostChange(value) {
      console.log('职位类型变化:', value)
    },
    getPosition(id) {
      getPositionById(id).then(res => {
        if (res.code) {
          this.positionFrom = res.data
        } else {
          this.$message({ type: 'error', message: res.msg })
        }
      })
    },
    save() {
      this.$refs.positionFrom.validate((valid) => {
        if (!valid) {
          console.log('error submit!!')
          return false
        }
        delete this.positionFrom.status
        // 添加
        if (this.positionFrom.id === '' || this.positionFrom.id === undefined || this.positionFrom.id === null) {
          delete this.positionFrom.id
          savePosition(this.positionFrom).then(res => {
            this.handleResult(res)
          }).catch(error => {
            console.error('添加失败:', error)
          })
          return
        }

        // 修改
        updatePosition(this.positionFrom).then(res => {
          this.handleResult(res)
        }).catch(error => {
          console.error('修改失败:', error)
        })
      })
    },
    handleResult(res) {
      if (res.code) {
        this.$message({
          type: 'success',
          message: res.msg
        })
        this.$router.push({ name: 'PublishedPosition' })
      } else {
        this.$message({
          type: 'error',
          message: res.msg
        })
      }
    }
  }
}
</script>

  <style scoped>
 ::v-deep .salary_style .el-input__inner .el-input {
    width: 10em;
  }
  .corporation_container{
      padding: 2em;
      height: 100%;
  }
  .el-upload-img {
    border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      height: 10em;
      width: 10em;
      display: flex;
      justify-content: center;
      align-items: center;
  }

  .el-upload-img:hover {
    border-color: #409eff; /* 鼠标悬停时改变边框颜色 */
  }
  ::v-deep .img_style{
    width: 20em;
  }
  .close:hover{
    cursor: pointer;
  }
  .upload_style{
    display: flex;
    justify-content: left;
  }
  ::v-deep .el-input{
    width: 35em;
  }

  ::v-deep .el-textarea__inner{
    height: 20em;
    width: 40em;
  }
  ::v-deep .el-button--medium{
    width: 7em;
  }
  </style>
