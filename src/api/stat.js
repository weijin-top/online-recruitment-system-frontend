
import request from '@/utils/request'

export function queryStatNum() {
  return request({
    url: '/stat/num',
    method: 'get'
  })
}

export function queryStatEdu() {
  return request({
    url: '/stat/edu',
    method: 'get'
  })
}

export function queryStatPosition() {
  return request({
    url: '/stat/position',
    method: 'get'
  })
}
