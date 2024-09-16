/*
 * @Author: 魏进 3413105907@qq.com
 * @Date: 2024-08-19 21:32:00
 * @LastEditors: 魏进 3413105907@qq.com
 * @LastEditTime: 2024-08-23 22:00:01
 * @FilePath: \online-recruitment-system\src\api\position.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request'

export function savePosition(data) {
  return request({
    url: `/position`,
    method: 'post',
    data
  })
}

export function pagingPosition(params) {
  return request({
    url: '/position/page',
    method: 'get',
    params
  })
}

export function getPositionDetails(id) {
  return request({
    url: `/position/detail/${id}`,
    method: 'get'
  })
}

export function getPositionById(id) {
  return request({
    url: `/position/${id}`,
    method: 'get'
  })
}

export function auditPosition(id, status) {
  return request({
    url: `/position/audit/${id}/${status}`,
    method: 'put'
  })
}

export function updatePosition(data) {
  return request({
    url: `/position`,
    method: 'put',
    data
  })
}

export function cancelPosition(id) {
  return request({
    url: `/position/${id}`,
    method: 'put'
  })
}
