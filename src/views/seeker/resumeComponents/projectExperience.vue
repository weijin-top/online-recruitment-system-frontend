<!--
 * @Author: 魏进 3413105907@qq.com
 * @Date: 2024-09-04 22:02:49
 * @LastEditors: 魏进 3413105907@qq.com
 * @LastEditTime: 2024-09-06 20:06:55
 * @FilePath: \online-recruitment-system\src\views\seeker\resumeComponents\info.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="container">
    <!-- 项目经历 -->
    <div class="outside-container">
      <div class="title-container">
        <div>项目经历</div>
        <div>
          <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addProject()">添加项目经历</el-button>
        </div>
      </div>
      <div class="content-container">
        <el-form
          v-for="(item,i) in listProjectFrom"
          :key="i"
          ref="projectFrom"
          style="margin-top: 1em;"
          :label-position="labelPosition"
          :rules="rules"
          :hide-required-asterisk="true"
          label-width="80px"
          :model="item"
          @submit.native.prevent
        >
          <div class="flex-between">
            <el-form-item label="项目名称" prop="projectName">
              <el-input v-model="item.projectName" clearable placeholder="项目名称" style="width: 20vw;" />
            </el-form-item>
            <!-- <el-form-item label="专业" prop="major" class="right-box">
              <el-input v-model="item.major" clearable placeholder="专业" />
            </el-form-item> -->
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
          <el-form-item label="项目内容" prop="content">
            <el-input
              v-model="item.content"
              class="el-textarea-style"
              clearable
              resize="none"
              type="textarea"
              placeholder="项目内容"
            />
          </el-form-item>
          <div style="margin-bottom: 3em;">
            <el-button type="primary" @click="save(i)">保存</el-button>
            <el-button type="danger" @click="deleteProject(item,i)">删除</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { queryProject, saveProject, modifyProject, delProject } from '@/api/project'
// import EduSelector from '@/components/Selector/eduSelector'
export default {
  name: 'EducationExperience',
  // components: { EduSelector },
  data: function() {
    return {
      labelPosition: 'right',
      listProjectFrom: [{
        id: '',
        projectName: '',
        // major: '',
        time: [],
        // endtime: '',
        // level: null,
        content: ''
      }],
      rules: {
        projectName: [
          { required: true, message: '请输入学校名称', trigger: 'blur' }
        ],
        // major: [
        //   { required: true, message: '请输入现居地', trigger: 'blur' }
        // ],
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
    this.getProject()
  },
  methods: {
    deleteProject(item, index) {
      if (item.id !== '' || item.id !== undefined) {
        delProject(item.id).then(res => {
          this.handleResult(res)
        }).catch(error => {
          console.error('修改失败:', error)
        })
      }
      this.listProjectFrom.splice(index, 1)
    },
    addProject() {
      this.listProjectFrom.push({
        id: '',
        projectName: '',
        // marjor: '',
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
    getProject() {
      queryProject().then(res => {
        if (res.code) {
          for (let i = 0; i < res.data.length; i++) {
            const element = res.data[i]
            element.time = [element.startTime, element.endTime]
            delete element.startTime
            delete element.endTime
          }
          this.listProjectFrom = res.data
        }
      })
    },
    save(index) {
      this.$refs.projectFrom[index].validate((valid) => {
        if (!valid) {
          console.log('error submit!!')
          return false
        }
        // 构建参数
        const from = this.listProjectFrom[index]
        from.startTime = from.time[0]
        from.endTime = from.time[1]
        delete from.time
        // 添加
        if (from.id === '' || from.id === undefined) {
          delete from.id
          saveProject(from).then(res => {
            this.handleResult(res)
          }).catch(error => {
            console.error('添加失败:', error)
          })
          return
        }
        // // 修改
        modifyProject(from).then(res => {
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
        this.getProject()
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
    height: 15vh;
  }
</style>
