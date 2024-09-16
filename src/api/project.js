
import request from '@/utils/request'

export function queryProject() {
  return request({
    url: `/project`,
    method: 'get'
  })
}

export function saveProject(data) {
  return request({
    url: `/project`,
    method: 'post',
    data
  })
}

export function modifyProject(data) {
  return request({
    url: `/project`,
    method: 'put',
    data
  })
}

export function delProject(id) {
  return request({
    url: `/project/${id}`,
    method: 'delete'
  })
}
