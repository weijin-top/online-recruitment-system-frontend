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

export function resetPassword(id) {
  return request({
    url: `/user/resetPassword/${id}`,
    method: 'put'
  })
}

export function pageUser(params) {
  return request({
    url: `/user/pageUser`,
    method: 'get',
    params
  })
}
