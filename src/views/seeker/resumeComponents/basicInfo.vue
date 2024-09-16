<!--
 * @Author: 魏进 3413105907@qq.com
 * @Date: 2024-09-04 22:02:49
 * @LastEditors: 魏进 3413105907@qq.com
 * @LastEditTime: 2024-09-06 12:54:39
 * @FilePath: \online-recruitment-system\src\views\seeker\resumeComponents\info.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="container">
    <!-- <div style="color: #409EFF;">基本信息</div>
    <el-divider /> -->
    <el-form
      ref="infoFrom"
      style="width: 80%;"
      :label-position="labelPosition"
      :rules="rules"
      :hide-required-asterisk="true"
      label-width="80px"
      :model="infoFrom"
      @submit.native.prevent
    >

      <el-form-item label="真实姓名" prop="name">
        <el-input v-model="infoFrom.name" clearable placeholder="真实姓名" />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model.number="infoFrom.gender">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="0">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input v-model.number="infoFrom.age" clearable placeholder="年龄" />
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="infoFrom.phone" clearable placeholder="手机号码" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="infoFrom.email" clearable placeholder="邮箱" />
      </el-form-item>
      <el-form-item label="现居住地" prop="address">
        <el-input v-model="infoFrom.address" clearable placeholder="现居住地" />
      </el-form-item>
      <el-form-item label="意向城市" prop="city">
        <el-input v-model="infoFrom.city" clearable placeholder="意向城市" />
      </el-form-item>
      <el-form-item label="意向岗位" prop="postId">
        <post-selector
          v-model.number="infoFrom.postId"
          :post="infoFrom.postId"
          :is-enable-auto-init-data="isInitPostData()"
        />
      </el-form-item>
      <el-form-item label="专业技能" prop="skill">
        <el-input
          v-model="infoFrom.skill"
          class="el-textarea-style"
          clearable
          resize="none"
          type="textarea"
          placeholder="专业技能"
        />
      </el-form-item>
      <el-form-item label="个人总结" prop="summary">
        <el-input
          v-model="infoFrom.summary"
          class="el-textarea-style"
          clearable
          resize="none"
          type="textarea"
          placeholder="个人总结"
        />
      </el-form-item>
    </el-form>
    <el-button type="primary" style="margin-top: 1em;" size="medium" @click="save()">保存</el-button>
  </div>
</template>

<script>
import PostSelector from '@/components/Selector/postSelector'
import { queryInfo, saveInfo, modifyInfo } from '@/api/info'

export default {
  name: 'BasicInfo',
  components: { PostSelector },
  data: function() {
    return {
      labelPosition: 'right',
      infoFrom: {
        id: '',
        name: '',
        postId: null,
        city: '',
        address: '',
        age: '',
        phone: '',
        email: '',
        gender: '',
        skill: '',
        summary: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入现居地', trigger: 'blur' }
        ],
        city: [
          { required: true, message: '请输入意向城市', trigger: 'blur' }
        ],
        age: [
          { required: true, message: '请输入年龄', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: this.validatePhone, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: this.validateEmail, trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        postId: [
          { required: true, message: '请选择意向岗位', trigger: 'change' }
        ],
        skill: [
          { required: true, message: '请输入专业技能', trigger: 'blur' }
        ],
        summary: [
          { required: true, message: '请输入个人总结', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    isInitPostData() {
      return this.infoFrom.postId !== '' || this.infoFrom.postId !== undefined || this.infoFrom.postId !== null
    },
    validatePhone(rule, value, callback) {
      if (!value) {
        return callback(new Error('电话号码不能为空'))
      }
      const pattern = /^1[3|4|5|7|8][0-9]{9}$/
      if (!pattern.test(value)) {
        return callback(new Error('请输入正确的手机号码'))
      }
      callback()
    },
    validateEmail(rule, value, callback) {
      if (!value) {
        return callback(new Error('电子邮件不能为空'))
      }
      const pattern = /^[A-Za-z0-9\u00C0-\u00FF]+(\.[_A-Za-z0-9\u00C0-\u00FF]+)*@[A-Za-z0-9]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/
      if (!pattern.test(value)) {
        return callback(new Error('请输入有效的电子邮件地址'))
      }
      callback()
    },
    getInfo() {
      queryInfo().then(res => {
        if (res.code) {
          this.infoFrom = res.data
        }
      })
    },
    save() {
      this.$refs.infoFrom.validate((valid) => {
        if (!valid) {
          console.log('error submit!!')
          return false
        }
        // 添加
        if (this.infoFrom.id === '' || this.infoFrom.id === undefined) {
          delete this.infoFrom.id
          saveInfo(this.infoFrom).then(res => {
            this.handleResult(res)
          }).catch(error => {
            console.error('添加失败:', error)
          })
          return
        }
        // 修改
        modifyInfo(this.infoFrom).then(res => {
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
        this.getInfo()
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
     width: 97%;
     margin: 0 auto;
     margin-top: 1em;
     padding: 1em;
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
    height: 10em;
    width: 55em;
  }
  ::v-deep .el-button--medium{
    width: 7em;
  }
  </style>
