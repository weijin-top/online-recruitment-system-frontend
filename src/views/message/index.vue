<!-- eslint-disable vue/no-parsing-error -->
<template>
  <div class="message-page_container" :style="dynamicWidthStyle">
    <!-- 左侧联系人 -->
    <div class="left-div">
      <div v-for="item in records" :key="item.id" class="left-div-item-div" @click="getMutualRecord(item)">
        <!-- 头像及在线标志 -->
        <div class="user-status-div">
          <img
            class="user-avatar-img"
            :src="item.avatar"
            alt="User Avatar"
          >
          <span v-if="existOnlineUsers(item.otherId)" class="status-online-div" />
        </div>
        <!-- 用户信息及最后聊天内容 -->
        <div class="user-msg-div">
          <!-- 用户信息 -->
          <div class="info-div">
            <div>
              <span> {{ item.name }} </span>
              <!-- <span class="company-span">阿里</span> -->
            </div>
            <span class="time-span">{{ item.createTime }}</span>
          </div>
          <!-- 最后一次聊天内容 -->
          <div class="last-and-unread">
            <div class="last-mag-div">{{ item.content }}</div>
            <div v-if="item.unreadCount !== 0" class="unread-div">{{ item.unreadCount < 100 ? item.unreadCount : '99+' }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 右侧具体聊天 聊天内容为空就隐藏 -->
    <div v-if="chatRecords.length !== 0" class="right-div">
      <!-- 用户信息 -->
      <div class="user-info-div">
        {{ otherName }}<!--<span> 阿里</span>-->
      </div>
      <!-- 职位信息 -->
      <!-- <div class="position-info-div"><span>后端开发实习生</span><span class="salary-span">6-8k</span><span>成都</span></div> -->
      <!-- 聊天内容 -->
      <div class="chat-content-div">
        <!-- 聊天记录 -->
        <div id="content" class="item-parent-div">
          <!-- 一条信息，判断后端给出是己方发送还是对方发送 -->
          <div v-for="item in chatRecords" :key="item.id">
            <!-- 时间 -->
            <div class="chat-time-div">{{ item.createTime }}</div>
            <!-- 左侧对方发送信息 发送方id是自己就不渲染左侧对方发送的信息 -->
            <div v-if="item.senderId !== currentUserId" class="right-content-item-div">
              <!-- 图片 -->
              <img
                class="chat-avatar-img"
                :src="otherAvatar"
              >
              <!-- 聊天内容 -->
              <div class="content-detail-div">{{ item.content }}</div>
            </div>
            <!-- 右侧己方发送信息 发送方id不是自己就不渲染右侧己方发送的信息 -->
            <div v-else class="right-content-item-div owner-message">
              <!-- 聊天内容 -->
              <div class="content-detail-div  self-style">{{ item.content }}</div>
              <!-- 图片 -->
              <img
                class="chat-avatar-img"
                :src="currentAvatar"
              >
            </div>
          </div>
        </div>
        <!-- 输入框和按钮 -->
        <div class="input-button-div">
          <el-autocomplete
            v-model="message"
            class="inline-input"
            :fetch-suggestions="querySearch"
            placeholder="请输入内容      按 Enter 发送，按 Alt + Enter 换行"
            :trigger-on-focus="false"
            type="textarea"
            :rows="2"
            clearable
            resize="none"
            @select="handleSelect"
            @keydown.native="handleKeyDown"
          />
          <el-button class="button-style" type="primary" @click="sendMessage">发送</el-button>
        </div>
      </div>
    </div>
    <!-- 空状态提示 默认开启，点击左侧聊天关闭 -->
    <div v-else class="no-data">
      <h2>暂无数据</h2>
      <p>与您进行过沟通的 Boss 都会在左侧列表中显示</p>
    </div>
  </div>
</template>

<script>

import { getRole, getUserId, getAvatar } from '@/utils/auth'
import { queryLastRecord, queryMutaulRecord, modifyMessageRead } from '@/api/message'
import { EventBus } from '@/utils/websocket'
export default {
  name: 'Message',
  data() {
    return {
      currentUserId: '',
      otherAvatar: '',
      currentAvatar: '',
      otherId: '',
      // 左侧联系人列表
      records: [],
      // 快捷信息
      quicklanguage: [],
      message: '',
      otherName: '',
      // 在线用户列表
      onlineUsers: [],
      // 聊天记录
      chatRecords: []
    }
  },
  // 计算属性，按角色计算狂口大小
  computed: {
    dynamicWidthStyle() {
      if (getRole() === 'seeker') {
        return { 'width': '1200px', 'margin-top': '1em', 'height': '90vh' }
      }
      return { 'width': '90%', 'height': '90vh' }
    }
  },
  // 监测对方id，对方id一改变说明，切换了聊天对象，
  // 在这里可以把前一个聊天中的信息设置为已读，把后一个没看的信息设置为已读，
  // 最后在页面销毁前，把最后一个聊天人的信息设置为已读，防止用户直接关闭页面，
  // 这样就可以保证，无论用户是两人聊天中产生的消息还是离线状态产生的消息都可以及时设置为已读
  watch: {
    otherId(newValue, oldValue) {
      // 旧值为空说明第一聊天，没有前一个聊天用户，无需设置已读
      if (oldValue) {
        // 有前一个聊天对象未读信息设置为已读
        this.updateMessageRead(oldValue)
      }
      // 新聊天对象设置为已读
      this.updateMessageRead(newValue)
    }
  },
 async created() {
    // 监听websocke收到消息发送来的事件
    EventBus.$on('websocket-message', this.handleMessage)
    // 获取自己id
    this.currentUserId = parseInt(getUserId())
    // 获取自己的头像
    this.currentAvatar = getAvatar()
    const currentRole = getRole()
    // 不同角色构建不同快捷消息
    if (currentRole === 'seeker') {
      this.quicklanguage = this.seekerQuickLanguage()
    } else if (currentRole === 'recruiter') {
      this.quicklanguage = this.recruiterQuickLanguage()
    }

    await this.fetchData()
    const type = this.$route.query.type;
    if (type === 1) {
      // 职位详情页跳转,获取到聊天列表第一个
      this.getMutualRecord(this.records[0])
    }
  },
  updated() {
    // 收到或发送信息股滚动条滚动到最下面
    this.scrollToBottom()
  },
  destroyed() {
    // 组件卸载时取消监听
    EventBus.$off('websocket-message', this.handleMessage)
    // 只有有聊天对象才在销毁时把对方消息设置为已读
    if (this.otherId) {
      this.updateMessageRead(this.otherId)
    }
  },
  methods: {

    // 收到websocket消息的方法
    handleMessage(res) {
      // 追加到数组中
      if (res.code === 2000) {
        // 状态码2000 正常发送信息
        const newMessage = res.data.messageFrom
        newMessage.createTime = this.getCurrentTime()
        // 没点击左侧聊天就不放数组里面放
        if (this.chatRecords.length === 0) {
          // 替换左侧最后一次聊天内容与未读消息数
          this.replaceLastRecord(newMessage)
          return
        }
        // 当前聊天不是对方发送的也不放进数组，以免错误渲染
        const firstContent = this.chatRecords[0]
        const newMessageSender = newMessage.senderId
        // 用数组中第一条聊天记录来判断，收到的信息发送方与数组中第一条信息接收方或发送方都对应不上，
        // 说明当前聊天窗口不是与新收到信息发送方的
        if (firstContent.receiverId !== newMessageSender &&
            firstContent.senderId !== newMessageSender) {
          // 替换左侧最后一次聊天内容与未读消息数
          this.replaceLastRecord(newMessage)
          return
        }
        this.chatRecords.push(newMessage)
      } else if (res.code === 2001) {
        // 状态码2001 收到在线用户列表
        this.onlineUsers = res.data
      }
    },
    // 判断是否存在在线用户列表中
    existOnlineUsers(id) {
      return this.onlineUsers.includes(id)
    },
    // 发送信息
    sendMessage() {
      if (!this.message) {
        this.$message({ type: 'warning', message: '请先输入内容，在尝试发送信息' })
        return
      }
      const jsonMsg = { receiverId: this.otherId, content: this.message,
        senderId: this.currentUserId }
      // websocket发送信息
      const flag = this.$sendMessage(jsonMsg)
      // 发送成功后把自己发送的信息追加到数组中
      if (flag) {
        jsonMsg.createTime = this.getCurrentTime()
        this.chatRecords.push(jsonMsg)
        this.message = ''
      }
    },
    // 设置消息状态为已读
    async updateMessageRead(otherId) {
      const res = await modifyMessageRead(otherId)
      if (res.code) {
        // 修改成功清除未读消息数量
        this.clearUnreadCount(otherId)
      } else {
        // 未修改成功，控制台输出消息已读未修改失败
        console.log('消息已读修改失败')
      }
    },
    // 根据对方id将左侧列表的未读消息数量设置为0，在将未读消息修改为已读后使用
    clearUnreadCount(otherId) {
      const targetRecord = this.records.find(record => record.otherId === otherId)
      if (targetRecord) {
        targetRecord.unreadCount = 0
      }
    },
    // 没有往数组中追加的信息，需要把替换为左边最后一次聊天，并且未读信息+1
    replaceLastRecord(message) {
      // 左侧聊天列表otherId 与 新消息的senderId相同就是要被替换的
      const targetRecord = this.records.find(record => record.otherId === message.senderId)
      targetRecord.content = message.content
      targetRecord.unreadCount = targetRecord.unreadCount + 1
    },
    // 处理键盘事件
    handleKeyDown(event) {
      // 按下 Enter 键
      if (event.key === 'Enter' && !event.altKey) {
        event.preventDefault() // 阻止默认的换行行为
        this.sendMessage() // 触发发送消息逻辑
      }
      // 按下 Alt + Enter 键
      if (event.key === 'Enter' && event.altKey) {
        // 不需要阻止默认行为，默认会换行

      }
    },
    querySearch(queryString, cb) {
      var quicklanguage = this.quicklanguage
      var results = queryString ? quicklanguage.filter(this.createFilter(queryString)) : quicklanguage
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect(item) {
      console.log(item)
    },
    async fetchData() {
      // this.listLoading = true
      const response = await queryLastRecord()
      if (response.code) {
        this.records = response.data
      } else {
        this.records = []
        this.$message({
          type: 'error',
          message: response.msg
        })
      }
    },
    // 获取两人聊天内容
    async getMutualRecord(item) {
      const response = await queryMutaulRecord(item.otherId)
      if (response.code) {
        this.chatRecords = response.data
        // 获取传过来的对方头像，在页面渲染
        this.otherAvatar = item.avatar
        this.otherId = item.otherId
        this.otherName = item.name
      } else {
        this.chatRecords = []
        this.$message({
          type: 'error',
          message: response.msg
        })
      }
    },
    // 使滚动条滚动到最下面
    scrollToBottom() {
      this.$nextTick(() => {
        var chatContainer = this.$el.querySelector('#content')
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight
        }
      })
    },
    // 获取当前时间
    getCurrentTime() {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}`
    },
    seekerQuickLanguage() {
      return [
        { value: '您好[愉快]' },
        { value: 'Boss，你好，可以聊聊吗？' },
        { value: '我可以去贵公司面试吗？' },
        { value: '您好，看到您的招聘信息，我很感兴趣，希望可以进一步沟通。' },
        { value: '您好，非常喜欢这个岗位，一定能够努力胜任，期待您的回复' },
        { value: '对不起，我觉得该职位不太适合我，祝您早日找到满意的工作人选' }
      ]
    },
    recruiterQuickLanguage() {
      return [
        { value: '您好[愉快]' },
        { value: '非常感谢您的应聘，但是我们在寻找的候选人与您工作背景不完全相符。祝您早日找到更好的机会！' },
        { value: '不好意思 看了您的简历，似乎不是很合适，祝您早日找到心仪的工作！' },
        { value: '对不起，看了你的简历以后觉得不太合适，希望你早日找到满意的工作机会' },
        { value: '抱歉，尽管我们对您的背景印象深刻，但该职位需要一些其他的技能和经验。祝您早日找到满意的工作！' },
        { value: '我们认真审阅了您的简历，但暂不完全匹配岗位情况。祝您早日找到更合适的机会！' },
        { value: '我们感谢您的投递，但您的专业技能与我们目前的职位需求并不完全吻合。祝您早日找到更适合您的工作！' },
        { value: '很抱歉，您的简历和我们当前的职位需求不是很匹配。祝您早日找到满意的工作！' }
      ]
    }
  }
}
</script>

<style scoped>
.message-page_container{
    height: 100%;
    margin: 0 auto;
    margin-top: 1em;
    background-color: #F4F6F9;
    display: flex;
}

.left-div{
  margin-right:10px;
  width:300px;
  white-space: nowrap; /* 防止文本换行 */
  overflow: hidden; /* 隐藏超出内容 */
  overflow-y: auto; /* 在内容超出高度时显示滚动条 */
}
.right-div{
  flex:1;
  display: flex;
  flex-direction: column;
}
.left-div,.right-div{
  background-color: #fff;
  border-radius:10px;
  padding:20px;
}
.left-div-item-div{
  display:flex;
  padding:5px;
  border-radius:3px;
  margin-bottom: 5px;
}
.left-div-item-div:hover{
  background-color:#F8F8F8;
}
.user-msg-div{
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  flex:1;
}
.status-online-div{
  display: inline-block;
  width: 10px;
  height: 10px;
  background-color: #02e502;
  border-radius: 50%;
  margin-left: 5px;
   position: absolute;
  right: 2%;
  bottom: 2%;
}
.user-avatar-img{
  width:60px;
  height: 60px;
   border-radius: 50%;
}
.chat-avatar-img{
  width: 40px;
  height: 40px;
   border-radius: 50%;
}
.user-status-div{
  width:60px;
  height: 60px;
  position: relative;
  margin-right:10px;
}
.last-mag-div{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color:#505050;
  width: 150px;
}
.info-div{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.time-span{
  color:#6a6a6a;
  font-size:12px;
}
.company-span{
  font-size:14px;
  margin-left:10px;
  color:#5a5a53;
}
.chat-content-div{
  flex: 1;
  padding: 0 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  white-space: normal; /* 允许文本换行 */
  overflow: hidden; /* 隐藏超出内容 */
  overflow-y: auto; /* 在内容超出高度时显示滚动条 */
}
.item-parent-div{
  display: flex;
  flex-direction: column; /* 垂直排列子元素 */
  flex: 1;
  white-space: normal; /* 允许文本换行 */
  overflow: hidden; /* 隐藏超出内容 */
  overflow-y: auto; /* 在内容超出高度时显示滚动条 */
}
.user-info-div{
  padding: 0 30px;
  height: 30px;
  border-bottom: solid 1px #e0e0e0;
}
/*.position-info-div{
  margin: 20px 0;
  padding: 15px 5px;
  background-color: #f8f8f8;
  border-radius: 5px;
}*/
/*.salary-span{
  margin: 0 20px;
  color: red;
}*/
.right-content-item-div{
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.content-detail-div{
  margin: 0 10px;
  padding: 10px;
  border-radius: 5px;
  background-color: #f8f8f8;
}
.chat-time-div{
  margin: 18px 0 10px 0;
  text-align: center;
  color: #6a6a6a;
  font-size: 14px;
}
.self-style{
  background-color: #409EFF;
  color: #fff;
}
.no-data {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 10px;
  flex: 1;
}

.no-data h2 {
  margin-bottom: 10px;
}

.no-data p {
  color: #666;
}
.owner-message{
  display: flex;
  justify-content: flex-end;
}
/* 自定义头像样式 */
.custom-avatar {
  overflow: hidden; /* 确保超出部分隐藏 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.custom-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.input-button-div{
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}
.inline-input{
  flex: 1;
  margin-right: 20px;
}
.button-style{
  width: 100px;
}
.last-and-unread{
  display: flex;
  justify-content: space-between;
}
.unread-div{
  color: white;
  background-color: rgba(255, 0, 0, 0.673);
  border-radius: 50%;
  padding: 2px;
  font-size: 10px;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
