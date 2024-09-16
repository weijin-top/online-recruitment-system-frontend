<template>
  <div class="contianer">
    <el-header v-if="isShow">
      <el-menu class="el-menu-demo" mode="horizontal">
        <el-menu-item index="/seeker/seekerIndex" @click="toPath('/seeker/seekerIndex')">首页</el-menu-item>
        <!-- <el-menu-item index="/search/searchIndex" @click="toPath('/search/searchIndex')">搜索</el-menu-item> -->
        <el-submenu index="/dorpInBox" @mouseenter.native="submenuEnterOnce">
          <template slot="title">投递箱</template>
          <el-menu-item index="/dorpInBox/notViewed" @click="toPath('/dorpInBox/notViewed')">未查看 {{ count.notViewedCount }}</el-menu-item>
          <el-menu-item index="/dorpInBox/viewed" @click="toPath('/dorpInBox/viewed')">已查看 {{ count.viewedCount }}</el-menu-item>
          <el-menu-item index="/dorpInBox/interested" @click="toPath('/dorpInBox/interested')">感兴趣 {{ count.interestedCount }}</el-menu-item>
          <el-menu-item index="/dorpInBox/interview" @click="toPath('/dorpInBox/interview')">约面试 {{ count.interviewCount }}</el-menu-item>
        </el-submenu>
        <el-menu-item index="/interview/myInterview" @click="toPath('/interview/myInterview')">我的面试</el-menu-item>
        <!-- <el-submenu index="2">
          <template slot="title">我的面试</template>
          <el-menu-item index="2-1">已通过</el-menu-item>
          <el-menu-item index="2-2">未通过</el-menu-item> -->
        <!-- <el-menu-item index="2-3"></el-menu-item> -->
        <!-- </el-submenu> -->
        <el-menu-item index="/resume/myResume" @click="toPath('/resume/myResume')">我的简历</el-menu-item>
        <!-- <el-menu-item index="4"><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item> -->
        <div>
          <avatar class="avatar-div" />
        </div>
      </el-menu>
    </el-header>
  </div>
</template>

<script>
import Avatar from './Avatar'
import { queryDeliveryCount } from '@/api/resumeDelivery'
export default {
  name: 'SeekerMenu',
  components: { Avatar },
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      submenuEntered: false, // 标志变量，初始为 false
      count: {
        notViewedCount: 0,
        viewedCount: 0,
        interestedCount: 0,
        interviewCount: 0
      }
    }
  },
  methods: {
    toPath(path) {
      this.$router.push(path)
    },
    submenuEnterOnce() {
      if (!this.submenuEntered) {
        // 执行你的方法
        queryDeliveryCount().then(res => {
          if (res.code) {
            this.count = res.data
          } else {
            console.log('error:', res.msg)
          }
        }).catch(err => {
          console.log('query delivery count error:', err)
        })
        this.submenuEntered = true // 设置为已触发状态
      }
    }
  }
}

</script>

<style scoped>

::v-deep .avatar-div{
    position: absolute;
    top: 50%;
    transform: translateY(-35%);
    right: 0;
}

.contianer{
  width: 100%;
  display: flex;
  justify-content: center;
}
::v-deep .el-menu-demo {
  width: 1200px;
}
</style>
