
import request from '@/utils/request'

export function queryInfo() {
  return request({
    url: `/info`,
    method: 'get'
  })
}

export function queryResume(userId) {
  return request({
    url: `/info/resume/${userId}`,
    method: 'get'
  })
}

export function saveInfo(data) {
  return request({
    url: `/info`,
    method: 'post',
    data
  })
}

export function modifyInfo(data) {
  return request({
    url: `/info`,
    method: 'put',
    data
  })
}
