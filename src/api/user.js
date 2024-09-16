import request from '@/utils/request'

export function getInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export function modifyUser(data) {
  return request({
    url: `/user`,
    method: 'put',
    data
  })
}

export function modifyPassword(data) {
  return request({
    url: `/user/password`,
    method: 'put',
    data
  })
}
