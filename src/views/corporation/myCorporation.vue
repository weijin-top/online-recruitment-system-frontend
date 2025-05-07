<template>
  <div class="corporation_container">
    <div style="color: #409EFF;">我的企业信息</div>
    <el-divider />
    <el-form
      ref="companyFrom"
      :label-position="labelPosition"
      :rules="rules"
      :hide-required-asterisk="true"
      label-width="80px"
      :model="companyFrom"
      @submit.native.prevent
    >

      <el-form-item label="公司名称" prop="name">
        <el-input v-model="companyFrom.name" clearable placeholder="公司名称" />
      </el-form-item>
      <el-form-item label="公司别名" prop="nickname">
        <el-input v-model="companyFrom.nickname" clearable placeholder="公司别名" />
      </el-form-item>
      <el-form-item label="公司地址" prop="address">
        <el-input v-model="companyFrom.address" clearable placeholder="公司地址" />
      </el-form-item>
      <el-form-item label="公司logo" prop="logo">
        <el-upload
          v-if="!companyFrom.logo"
          class="el-upload-img"
          :action="server"
          list-type="picture"
          :multiple="false"
          :limit="1"
          :headers="header"
          :accept="accept"
          :before-upload="beforeUpload"
          :on-success="handleSuccess"
          :on-error="handleError"
          ref="uploadRef"
        >
          <i class="el-icon-plus" />
        </el-upload>
        <div v-if="companyFrom.logo" class="upload_style">
          <el-image
            :src="companyFrom.logo"
            :preview-src-list="[companyFrom.logo]"
            fit="cover"
            :lazy="false"
            style="max-width: 100%; max-height: 100%;"
            class="img_style"
          />
          <i class="el-icon-circle-close close" @click="closeImage()" />
        </div>
      </el-form-item>
      <el-form-item label="公司简介" prop="intro">
        <el-input
          v-model="companyFrom.intro"
          class="el-textarea-style"
          clearable
          resize="none"
          type="textarea"
          placeholder="公司简介"
        />
      </el-form-item>
      <el-form-item v-if="companyFrom.status != undefined && companyFrom.status !==''" label="公司状态">
        <el-tag v-if="companyFrom.status === 0">审核中</el-tag>
        <el-tag v-else-if="companyFrom.status === 1" type="success">通过</el-tag>
        <el-tag v-else-if="companyFrom.status === 2" type="danger">不通过</el-tag>
      </el-form-item>
    </el-form>
    <el-button type="primary" style="margin-top: 1em;" size="medium" @click="save()">保存</el-button>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { saveCompany, modifyCompany, singleCompany } from '@/api/company'

export default {
  name: 'MyCorporation',
  data() {
    return {
      labelPosition: 'right',
      companyFrom: {
        id: '',
        name: '',
        nickname: '',
        address: '',
        logo: '',
        intro: ''
      },
      server: 'api/common/uploadImage',
      header: {},
      accept: '.jpg,.jpeg,.png,.webp,.svg,.bmp',
      rules: {
        name: [
          { required: true, message: '请输入公司名称', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请输入公司别名', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入公司地址', trigger: 'blur' }
        ],
        logo: [
          { required: true, message: '请上传公司logo', trigger: 'change' }
        ],
        intro: [
          { required: true, message: '请输入公司简介', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.header = { Authorization: getToken() }
    this.queryCompany()
  },
  methods: {
    queryCompany() {
      singleCompany().then(res => {
        if (res.code) {
          this.companyFrom = res.data
        }
      })
    },
    closeImage() {
      this.companyFrom.logo = ''
    },
    save() {
      this.$refs.companyFrom.validate((valid) => {
        if (!valid) {
          console.log('error submit!!')
          return false
        }
        delete this.companyFrom.status
        // 添加
        if (this.companyFrom.id === '' || this.companyFrom.id === undefined) {
          delete this.companyFrom.id
          saveCompany(this.companyFrom).then(res => {
            this.handleResult(res)
          }).catch(error => {
            console.error('添加失败:', error)
          })
          return
        }
        // 修改
        modifyCompany(this.companyFrom).then(res => {
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
        this.queryCompany()
      } else {
        this.$message({
          type: 'error',
          message: res.msg
        })
      }
    },
    handleSuccess(response, file, fileList) {
      if (response.code === 1) {
        this.$message({
          type: 'success',
          message: response.msg
        })
        this.companyFrom.logo = response.data // 保存图片URL到表单
        this.$refs.uploadRef.clearFiles() // 重置上传组件的文件列表
      } else {
        this.$message({
          type: 'error',
          message: response.msg
        })
        this.companyFrom.logo = null
      }
    },
    handleError(err, file, fileList) {
      this.$message({
        type: 'error',
        message: err
      })
      this.$refs.uploadRef.clearFiles() // 重置上传组件的文件列表
    },
    beforeUpload(file) {
      const isImage = file.type.startsWith('image/')
      const isLt2M = file.size / 1024 < 500n

      if (!isImage) {
        this.$message.error('上传的文件必须是图片!')
      }
      if (!isLt2M) {
        this.$message.error('上传的图片大小不能超过 500K!')
      }
      return isImage && isLt2M
    }

  }
}
</script>

<style scoped>
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
