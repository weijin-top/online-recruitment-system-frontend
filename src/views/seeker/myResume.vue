<template>
  <div class="container">
    <!-- <div class="tip-box">温馨提示：简历最好控制在一页，你所预览看见的完整简历，就是招聘者看到的简历</div> -->
    <el-tabs v-model="activeTab" :tab-position="'right'">
      <el-tab-pane label="基本信息" name="basicInfo" style="height: auto;">
        <basic-info v-if="activeTab === 'basicInfo'" />
      </el-tab-pane>
      <el-tab-pane label="教育经历" name="educationExperience" style="height: auto;">
        <education-experience v-if="activeTab === 'educationExperience'" />
      </el-tab-pane>
      <el-tab-pane label="实习/工作经历" name="jobExperience" style="height: auto;">
        <job-experience v-if="activeTab === 'jobExperience'" />
      </el-tab-pane>
      <el-tab-pane label="项目经历" name="projectExperience" style="height: auto;">
        <project-experience v-if="activeTab === 'projectExperience'" />
      </el-tab-pane>
      <el-tab-pane label="简历预览" name="resumePreview" style="height: auto;">
        <resume-preview v-if="activeTab === 'resumePreview'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import BasicInfo from './resumeComponents/basicInfo'
import EducationExperience from './resumeComponents/educationExperience'
import JobExperience from './resumeComponents/jobExperience'
import ProjectExperience from './resumeComponents/projectExperience'
import ResumePreview from './resumeComponents/resumePreview'

export default {
  name: 'MyResume',
  components: { BasicInfo, EducationExperience, JobExperience, ProjectExperience, ResumePreview },
  data: function() {
    return {
      activeTab: 'basicInfo'
    }
  }
}
</script>

<style scoped>
.container{
   background-color: rgb(255,255,255);

   width: 1200px;
   margin: 0 auto;
   margin-top: 1em;
   padding: 1em;
}
.tip-box{
  display: flex;
  justify-content: center;
  color: red;

}
</style>
