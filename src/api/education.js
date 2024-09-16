
import request from '@/utils/request'

export function queryEducation() {
  return request({
    url: `/education`,
    method: 'get'
  })
}

export function saveEducation(data) {
  return request({
    url: `/education`,
    method: 'post',
    data
  })
}

export function modifyEducation(data) {
  return request({
    url: `/education`,
    method: 'put',
    data
  })
}

export function delEducation(id) {
  return request({
    url: `/education/${id}`,
    method: 'delete'
  })
}
