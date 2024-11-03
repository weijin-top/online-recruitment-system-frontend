/*
 * @Author: 魏进 3413105907@qq.com
 * @Date: 2024-10-09 20:03:10
 * @LastEditors: 魏进 3413105907@qq.com
 * @LastEditTime: 2024-10-09 20:07:58
 * @FilePath: \online-recruitment-system-frontend\src\utils\confirmService.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// confirmService.js
import { MessageBox, Message } from 'element-ui'

export function showConfirmDialog(message, title = '提示', type = 'warning') {
  return new Promise((resolve, reject) => {
    MessageBox.confirm(message, title, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: // 使用传入的type或者默认为'warning'
        type || 'warning'
    }).then(() => {
      resolve()
      // Message({
      //   message: '操作成功!',
      //   type: 'success'
      // })
    }).catch(() => {
      reject()
      Message({
        message: '已取消操作',
        type: 'info'
      })
    })
  })
}
