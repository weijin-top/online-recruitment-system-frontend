<template>
  <div class="tree-node" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
    <span>
      <!-- 三角形图标用于展开/收起 -->
      <i
        v-if="hasChildren && node.expanded"
        class="el-icon-caret-bottom expand-icon"
        @click.prevent="toggleExpand"
      />
      <i
        v-if="hasChildren &&!node.expanded"
        class="el-icon-caret-right expand-icon"
        @click.prevent="toggleExpand"
      />

      <!-- 节点标签 -->
      <span v-if="!isEditing" class="node-label">
        {{ node.label }}
      </span>
      <input v-if="isEditing" v-model="node.label" type="text" @blur="onBlur" @keyup.enter="$event.target.blur()">

      <!-- 编辑、添加、删除按钮 -->
      <i v-if="showActions && node.level !== 0" class="material-icons action-icon" @click="handleEdit">edit</i>
      <i v-if="showActions && (node.level < maxLevel - 1)" class="material-icons action-icon" @click="handleAdd">add</i>
      <i v-if="showActions && node.level !== 0" class="material-icons action-icon" @click="handleRemove">remove</i>
    </span>
    <ul v-if="node.children.length > 0 && node.expanded" style="margin-top: 5px;">
      <TreeNode v-for="(child, index) in node.children" :key="index" :node="child" @edit="$emit('edit', child)" @add="$emit('add', child)" @remove="$emit('remove', child)" @get="$emit('get', true)" />
    </ul>
  </div>
</template>

<script>
import { savePost, modifyPost, delPost } from '@/api/post'
import { showConfirmDialog } from '@/utils/confirmService'
export default {
  name: 'TreeNode',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    node: {
      type: Object
    }
  },
  data() {
    return {
      showActions: false,
      isEditing: false,
      maxLevel: 4
    }
  },
  computed: {
    hasChildren() {
      return this.node.children.length > 0
    }
  },
  methods: {
    handleMouseLeaveExpandIcon(expanded) {
      // 如果节点正在编辑状态或者显示动作状态，则不处理鼠标离开事件
      if (this.isEditing || this.showActions) {
        return
      }
      this.node.expanded = expanded
    },
    onMouseEnter() {
      // 判断是否在编辑状态，如果是则不显示操作图标
      if (this.isEditing) {
        return
      }
      // 判断是否在展开/收起图标上，如果是则不显示操作图标
      const expandIcon = this.$el.querySelector('.expand-icon')
      const isMouseOnExpandIcon = expandIcon && expandIcon.contains(this.$el.ownerDocument.elementFromPoint(event.clientX, event.clientY))
      if (isMouseOnExpandIcon) {
        return
      }
      this.showActions = true
    },

    onMouseLeave() {
      // 判断是否在编辑状态，如果是则不隐藏操作图标
      if (this.isEditing) {
        return
      }
      // 判断是否在展开/收起图标上，如果是则不隐藏操作图标
      const expandIcon = this.$el.querySelector('.expand-icon')
      const isMouseOnExpandIcon = expandIcon &&
        expandIcon.contains(this.$el.ownerDocument.elementFromPoint(event.clientX, event.clientY))
      if (isMouseOnExpandIcon) {
        return
      }
      this.showActions = false
    },
    toggleExpand() {
      this.node.expanded = !this.node.expanded
      // 强制设置 showActions 为 false，确保点击展开/收起时不触发鼠标离开的效果
      this.showActions = false
    },
    handleEdit() {
      this.isEditing = true
    },
    handleAdd() {
      const newNode = {
        id: Date.now(), // 使用当前时间戳作为临时 ID
        pid: this.node.id,
        label: `New Child Node`, // 默认标签
        isNew: true, // 表示为新节点
        level: this.node.level + 1,
        children: []
      }

      // 将新节点添加到目标节点的 children 数组中
      this.node.children.push(newNode)
      // this.$emit('add', this.node)
      this.resetActions()
    },
    handleRemove() {
      // const parentNode = this.findParent(this.node);
      // console.log(parentNode);

      // if (parentNode) {
      //   const index = parentNode.children.findIndex(child => child.id === this.node.id);
      //   if (index !== -1) {
      //     parentNode.children.splice(index, 1);
      //     this.$emit('remove', this.node);
      //   }
      // }
      // this.resetActions();
      // console.log(this.node)
      showConfirmDialog('此操作将永久删除该职位类别, 是否继续?')
        .then(() => {
          // 用户点击了确定
          this.deletePost(this.node)
        })
        .catch(() => {
          // 用户点击了取消
        })
      // this.$emit('remove', this.node)
      this.resetActions()
    },
    onBlur(event) {
      this.isEditing = false
      if (this.node.isNew) {
        // 添加
        // 如果parentId就是根节点，需要移除，否则违反了数据库约束
        if (this.node.pid === 0) {
          delete this.node.pid
        }
        const data = { parentId: this.node.pid, name: this.node.label }
        this.addPost(data)
      } else {
        // 修改
        const data = { id: this.node.id, name: this.node.label }
        this.updatePost(data)
      }
      // this.$emit('edit', this.node)
      this.resetActions()
    },
    resetActions() {
      this.showActions = false
    },
    addPost(data) {
      savePost(data).then(res => {
        this.handleResult(res)
      })
    },
    updatePost(data) {
      modifyPost(data).then(res => {
        this.handleResult(res)
      })
    },
    deletePost(node) {
      delPost(node.id).then(res => {
        this.handleResult(res)
      })
    },
    handleResult(res) {
      if (res.code) {
        this.$message({
          type: 'success',
          message: res.msg
        })
        // 让父节点重新获取数据
        this.$emit('get', true)
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
.tree-node {
  margin-top: 5px;
  padding-left: 20px;
  position: relative;
  cursor: pointer;
}

.tree-node .node-label {
  flex-grow: 1;
  color: #000; /* 文本颜色设置为黑色 */
}

.tree-node .expand-icon {
  color: #000; /* 图标颜色设置为黑色 */
  margin-right: 10px; /* 右边距 */
}

.tree-node .action-icon {
  color: #2196F3; /* 图标颜色设置为蓝色 */
  margin-left: 10px; /* 左边距 */
  margin-right: 10px; /* 右边距 */
}

.tree-node .action-icon:hover,
.tree-node .expand-icon:hover {
  color: #0d47a1; /* 鼠标悬停时的颜色 */
}

.tree-node:hover {
  background-color: #f0f0f0;
}
</style>
