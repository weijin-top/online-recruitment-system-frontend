
import request from '@/utils/request'

export function queryJob() {
  return request({
    url: `/job`,
    method: 'get'
  })
}

export function saveJob(data) {
  return request({
    url: `/job`,
    method: 'post',
    data
  })
}

export function modifyJob(data) {
  return request({
    url: `/job`,
    method: 'put',
    data
  })
}

export function delJob(id) {
  return request({
    url: `/job/${id}`,
    method: 'delete'
  })
}
