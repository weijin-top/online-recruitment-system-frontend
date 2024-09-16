import request from '@/utils/request'

export function queryPost() {
  return request({
    url: `/post`,
    method: 'get'
  })
}

export function savePost(data) {
  return request({
    url: `/post`,
    method: 'post',
    data
  })
}

export function modifyPost(data) {
  return request({
    url: `/post`,
    method: 'put',
    data
  })
}

export function delPost(id) {
  return request({
    url: `/post/${id}`,
    method: 'delete'
  })
}
