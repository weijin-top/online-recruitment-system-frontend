/*
 * @Author: 魏进 3413105907@qq.com
 * @Date: 2024-07-02 22:21:48
 * @LastEditors: 魏进 3413105907@qq.com
 * @LastEditTime: 2025-03-27 21:01:53
 * @FilePath: \vue-admin-template\src\api\auth.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request'

export function queryLastRecord(data) {
  return request({
    url: '/message/getLastRecord',
    method: 'get'
  })
}

export function queryMutaulRecord(otherId) {
  return request({
    url: `/message/getMutualRecord/${otherId}`,
    method: 'get'
  })
}

export function modifyMessageRead(otherId) {
  return request({
    url: `/message/modifyMessageRead/${otherId}`,
    method: 'put'
  })
}
