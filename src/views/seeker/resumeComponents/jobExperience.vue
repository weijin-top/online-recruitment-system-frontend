<template>
  <div class="container">
    <!-- 工作/实习 -->
    <div class="outside-container">
      <div class="title-container">
        <div>工作/实习</div>
        <div>
          <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addJob()">添加工作/实习</el-button>
        </div>
      </div>
      <div class="content-container">
        <el-form
          v-for="(item,i) in listJobFrom"
          :key="i"
          ref="jobFrom"
          style="margin-top: 1em;"
          :label-position="labelPosition"
          :rules="rules"
          :hide-required-asterisk="true"
          label-width="80px"
          :model="item"
          @submit.native.prevent
        >
          <div class="flex-between">
            <el-form-item label="公司名称" prop="companyName">
              <el-input v-model="item.companyName" clearable placeholder="公司名称" style="width: 20vw;" />
            </el-form-item>
            <el-form-item label="职位" prop="position" class="right-box">
              <el-input v-model="item.position" clearable placeholder="职位" />
            </el-form-item>
          </div>
          <div class="flex-between">
            <el-form-item label="时间" prop="time">
              <el-date-picker
                v-model="item.time"
                style="width: 20vw;"
                type="monthrange"
                clearable
                range-separator="至"
                start-placeholder="开始月份"
                end-placeholder="结束月份"
                format="yyyy-MM"
                value-format="yyyy-MM"
                locale="zhCh"
              />
            </el-form-item>
            <!-- <el-form-item label="学历" prop="level" class="right-box">
              <edu-selector
                v-model="item.level"
                style="margin-bottom: 10px"
                :is-show-no-limit="false"
                :education="item.level"
              />
            </el-form-item> -->
          </div>
          <el-form-item label="工作描述" prop="content">
            <el-input
              v-model="item.content"
              class="el-textarea-style"
              clearable
              resize="none"
              type="textarea"
              placeholder="工作描述"
            />
          </el-form-item>
          <div style="margin-bottom: 3em;">
            <el-button type="primary" @click="save(i)">保存</el-button>
            <el-button type="danger" @click="deleteJob(item,i)">删除</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { queryJob, saveJob, modifyJob, delJob } from '@/api/job'
// import EduSelector from '@/components/Selector/eduSelector'
export default {
  name: 'JobExperience',
  // components: { EduSelector },
  data: function() {
    return {
      labelPosition: 'right',
      listJobFrom: [{
        id: '',
        companyName: '',
        position: '',
        time: [],
        // endtime: '',
        // level: null,
        content: ''
      }],
      rules: {
        companyName: [
          { required: true, message: '请输入学校名称', trigger: 'blur' }
        ],
        position: [
          { required: true, message: '请输入现居地', trigger: 'blur' }
        ],
        // city: [
        //   { required: true, message: '请输入意向城市', trigger: 'blur' }
        // ],
        // age: [
        //   { required: true, message: '请输入年龄', trigger: 'blur' }
        // ],
        // phone: [
        //   { required: true, message: '请输入手机号', trigger: 'blur' },
        //   { validator: this.validatePhone, trigger: 'blur' }
        // ],
        // email: [
        //   { required: true, message: '请输入邮箱', trigger: 'blur' },
        //   { validator: this.validateEmail, trigger: 'blur' }
        // ],
        // level: [
        //   { required: true, message: '请选择学历', trigger: 'change' }
        // ],
        time: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getJob()
  },
  methods: {
    deleteJob(item, index) {
      if (item.id !== '' || item.id !== undefined) {
        delJob(item.id).then(res => {
          this.handleResult(res)
        }).catch(error => {
          console.error('修改失败:', error)
        })
      }
      this.listJobFrom.splice(index, 1)
    },
    addJob() {
      this.listJobFrom.push({
        id: '',
        companyName: '',
        position: '',
        time: [],
        // endtime: '',
        // level: '',
        content: ''
      })
    },
    // validatePhone(rule, value, callback) {
    //   if (!value) {
    //     return callback(new Error('电话号码不能为空'))
    //   }
    //   const pattern = /^1[3|4|5|7|8][0-9]{9}$/
    //   if (!pattern.test(value)) {
    //     return callback(new Error('请输入正确的手机号码'))
    //   }
    //   callback()
    // },
    // validateEmail(rule, value, callback) {
    //   if (!value) {
    //     return callback(new Error('电子邮件不能为空'))
    //   }
    //   const pattern = /^[A-Za-z0-9\u00C0-\u00FF]+(\.[_A-Za-z0-9\u00C0-\u00FF]+)*@[A-Za-z0-9]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/
    //   if (!pattern.test(value)) {
    //     return callback(new Error('请输入有效的电子邮件地址'))
    //   }
    //   callback()
    // },
    getJob() {
      queryJob().then(res => {
        if (res.code) {
          for (let i = 0; i < res.data.length; i++) {
            const element = res.data[i]
            element.time = [element.startTime, element.endTime]
            delete element.startTime
            delete element.endTime
          }
          this.listJobFrom = res.data
        }
      })
    },
    save(index) {
      this.$refs.jobFrom[index].validate((valid) => {
        if (!valid) {
          console.log('error submit!!')
          return false
        }
        // 构建参数
        const from = this.listJobFrom[index]
        from.startTime = from.time[0]
        from.endTime = from.time[1]
        delete from.time
        // 添加
        if (from.id === '' || from.id === undefined) {
          delete from.id
          saveJob(from).then(res => {
            this.handleResult(res)
          }).catch(error => {
            console.error('添加失败:', error)
          })
          return
        }
        // // 修改
        modifyJob(from).then(res => {
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
        this.getJob()
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
  .container{
      /* background-color: rgb(255,255,255);*/
      margin: 0 auto;
      margin-top: 1em;
      padding: 1em;
  }
  .outside-container{
    display: flex;
    flex-direction: column;
    border: 1px solid rgb(224, 224, 224);
    width: 80%;
  }
  .title-container{
    font-size: 20px;
    height: 3em;
    border-bottom: 1px solid rgb(224, 224, 224);
    line-height: 3em;
    padding: 0 1em;
    display: flex;
    justify-content: space-between;
  }
  .content-container{

    padding: 1em;
  }
  .flex-between{
    display: flex;

  }
  .right-box{
    margin-left: 2em;
  }
  ::v-deep .el-textarea__inner{
    width: 45vw;
    height: 10vh;
  }
</style>
