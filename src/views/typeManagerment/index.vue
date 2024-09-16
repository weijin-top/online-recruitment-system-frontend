<template>
  <div class="type-contianer">
    <TreeNode :node="rootNode" @edit="editNode" @add="addNode" @remove="removeNode" @get="handleGet" />
  </div>
</template>

<script>
import TreeNode from './treeNode'
import { queryPost } from '@/api/post'

export default {
  name: 'TypeManager',
  components: {
    TreeNode
  },
  data() {
    return {
      rootNode: {
        label: 'Root Node',
        level: 0,
        children: [
          {
            label: 'Child Node 1',
            level: 1,
            children: [
              {
                label: 'Grandchild Node 1',
                level: 2,
                children: []
              },
              {
                label: 'Grandchild Node 2',
                level: 2,
                children: []
              }
            ]
          },
          {
            label: 'Child Node 2',
            level: 1,
            children: []
          }
        ]
      }
    }
  },
  created() {
    this.getPost()
  },
  methods: {
    getPost() {
      queryPost().then(res => {
        if (res.code) {
          this.rootNode = this.convertData(res.data)
        }
      })
    },
    editNode(node) {
      console.log(`Editing ${node.label}`)
      // 这里可以更新node的label或其他属性
    },
    addNode(parentNode) {
      // if (parentNode.level < 3) { // 确保不超过三级
      //   const newNode = {
      //     label: 'New Child Node',
      //     level: parentNode.level + 1,
      //     children: []
      //   }
      //   parentNode.children.push(newNode)
      // }
    },
    removeNode(node) {
      const parent = this.findParent(node)
      if (parent) {
        const index = parent.children.findIndex(n => n === node)
        parent.children.splice(index, 1)
      }
    },

    // getParentNode(node) {
    //   const findParent = (parentNode, targetNode) => {
    //     for (let i = 0; i < parentNode.children.length; i++) {
    //       if (parentNode.children[i] === targetNode) {
    //         return parentNode
    //       } else {
    //         const result = findParent(parentNode.children[i], targetNode)
    //         if (result) return result
    //       }
    //     }
    //     return null
    //   }
    //   return findParent(this.rootNode, node)
    // },
    // 格式化数据
    convertData(data) {
      const root = {
        id: '0',
        pid: null,
        label: '职位类别',
        expanded: true,
        level: 0,
        children: []
      }

      function processChildren(parent, childrenData) {
        if (childrenData.length !== 0) {
          childrenData.forEach(child => {
            const childNode = {
              id: child.id,
              pid: child.parentId,
              label: child.name,
              expanded: true,
              level: parent.level + 1,
              children: []
            }
            processChildren(childNode, child.postVOS)
            parent.children.push(childNode)
          })
        }
      }

      processChildren(root, data)
      return root
    },
    handleGet(data) {
      if (data) {
        this.getPost()
      }
    }

  }
}
</script>

<style scoped>
.type-contianer{
  margin-top: 20px;
}
</style>
