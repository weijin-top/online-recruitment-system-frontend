<template>
  <div class="home-page_container" :style="dynamicWidthStyle">
    <div style="color: #409EFF;" class="content">个人主页</div>
    <el-divider class="divider-line" />
    <!-- 用户信息 -->
    <div class="content">
      <div style="font-weight: 700;">用户信息</div>
      <el-form
        ref="userFrom"
        :hide-required-asterisk="true"
        :rules="userRules"
        :inline="true"
        :model="userFrom"
        class="user-form"
      >
        <!-- <div> -->
        <!-- <div class="flex-coulmn"> -->
        <el-form-item label="用户名" prop="username" style="margin-left: 0;">
          <el-input v-model="userFrom.username" placeholder="用户名" clearable />
        </el-form-item>
        <!-- </div> -->
        <el-form-item prop="avatar">
          <el-upload
            class="avatar-uploader"
            :action="server"
            :headers="header"
            :accept="accept"
            :limit="1"
            :show-file-list="false"
            :on-success="handleSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="userFrom.avatar" :src="userFrom.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <!-- </div> -->
        <!-- <div> -->
        <el-form-item label="角色">
          <el-input v-model="userFrom.roleId" disabled />
        </el-form-item>
        <el-form-item label="注册时间">
          <el-input v-model="time" disabled />
        </el-form-item>
        <!-- </div> -->
      </el-form>
      <el-button type="primary" style="margin-top: 30px;" @click="saveUserInfo()">保存</el-button>
      <!-- </div> -->
      <el-divider class="divider-line middle-line" />
      <!-- 修改密码 -->
      <div class="content">
        <div class="title-container">修改密码</div>

        <el-form
          ref="passwordFrom"
          :label-position="labelPosition"
          label-width="80px"
          :model="passwordFrom"
          :hide-required-asterisk="true"
          :rules="passwordRules"
        >
          <el-form-item label="旧密码" prop="oldPassword">
            <el-input v-model="passwordFrom.oldPassword" clearable show-password />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="passwordFrom.newPassword" clearable show-password />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="passwordFrom.confirmPassword" clearable show-password />
          </el-form-item>
        </el-form>
        <el-button type="primary" style="margin-top: 30px;" @click="savePassword()">保存</el-button>
      </div>

    </div>
  </div></template>

<script>
import { getToken, getUserId, getRole } from '@/utils/auth'
import { modifyPassword, modifyUser, getInfo } from '@/api/user'
import { validUsername } from '@/utils/validate'
import { mapGetters } from 'vuex'
export default {
  name: 'HomePage',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('用户名只能是英文'))
      } else {
        callback()
      }
    }
    return {
      server: 'api/common/uploadImage',
      header: {},
      accept: '.jpg,.jpeg,.png,.webp,.svg',
      labelPosition: 'left',
      userFrom: {
        id: null,
        username: null,
        avatar: null,
        createTime: '',
        roleId: null
      },
      passwordFrom: {
        id: null,
        oldPassword: null,
        newPassword: null,
        confirmPassword: null
      },
      userRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        avatar: [{ required: true, trigger: 'change', message: '请上传头像' }]
      },
      passwordRules: {
        oldPassword: [{ required: true, trigger: 'blur', message: '请输入旧密码' }],
        newPassword: [{ required: true, trigger: 'blur', message: '请输入新密码' }],
        confirmPassword: [{ required: true, trigger: 'blur', message: '请输入确认密码' }]
      }
    }
  },
  computed: {
    dynamicWidthStyle() {
      if (getRole() === 'seeker') {
        return { 'width': '1200px', 'margin-top': '1em', 'padding': '1em', 'height': '100vh' }
      }
      return {}
    },

    ...mapGetters([
      'avatar'
    ]),
    time() {
      return this.formatDateTime(this.userFrom.createTime)
    }
  },
  created() {
    this.header = { Authorization: getToken() }
    this.queryInfo()
  },
  methods: {
    // isSeeker() {
    //   console.log(getRole() === 'seeker');

    //   return
    // },
    handleSuccess(response, file, fileList) {
      if (response.code === 1) {
        this.$message({
          type: 'success',
          message: response.msg
        })
        this.userFrom.avatar = response.data // 保存图片URL到表单
      } else {
        this.$message({
          type: 'error',
          message: response.msg
        })
      }
    },
    beforeAvatarUpload(file) {
      const isImage = file.type.startsWith('image/')
      const isLt2M = file.size / 1024 < 500n

      if (!isImage) {
        this.$message.error('上传的文件必须是图片!')
      }
      if (!isLt2M) {
        this.$message.error('上传的图片大小不能超过 500K!')
      }
      return isImage && isLt2M
    },
    saveUserInfo() {
      this.$refs.userFrom.validate((valid) => {
        if (!valid) {
          console.log('error submit!!')
          return false
        }
        // 构建参数
        this.userFrom.id = getUserId()
        delete this.userFrom.roleId
        delete this.userFrom.createTime
        modifyUser(this.userFrom).then(res => {
          if (res.code) {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.queryInfo()
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        })
      })
    },
    async savePassword() {
      this.$refs.passwordFrom.validate(async(valid) => {
        if (!valid) {
          console.log('error submit!!')
          return false
        }
        // 构建参数
        this.passwordFrom.id = getUserId()
        const res = await modifyPassword(this.passwordFrom)
        if (res.code) {
          this.$message({
            type: 'success',
            message: res.msg
          })
          await this.$store.dispatch('user/logout')
          this.$router.push(`/login`)
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
      })
    },
    queryInfo() {
      getInfo().then(res => {
        if (res.code) {
          this.userFrom = res.data
          this.userFrom.createTime = res.data.createTime.replace('T', ' ')
          this.userFrom.roleId = this.roleMap(res.data.roleId)
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
      })
    },
    roleMap(roleId) {
      if (roleId === 1) {
        return '管理员'
      } else if (roleId === 2) {
        return '招聘者'
      } else if (roleId === 3) {
        return '求职者'
      }
    },
    formatDateTime(dateTime) {
      return dateTime.replace('T', ' ')
    }
  }
}
</script>

<style scoped>
.home-page_container{
    padding: 2em;
    height: 100%;
    margin: 0 auto;
    margin-top: 1em;
    background-color: #fff;
}
.title-container{
  font-weight: 700;
  margin-bottom: 30px;
}
.divider-line{
  margin: 30px 0 50px 0;
}
.content{
  margin-left: 0px;
}
::v-deep .avatar-uploader .el-upload {

  width: 100px;
  width: 100px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
::v-deep .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
::v-deep .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
.user-form{
  display: flex;
  align-items: center;
}
.flex-coulmn{
  display: flex;
  flex-direction: column;
}
::v-deep .el-input__inner{
  width: 200px;
}
.middle-line{
  width: 800px;
}
::v-deep .el-form-item{
  margin: 20px 30px;
}
.width-1200{
  width: 1200px;
}
</style>
