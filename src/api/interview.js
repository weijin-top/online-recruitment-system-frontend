
import request from '@/utils/request'

export function pageInterview(params) {
  return request({
    url: `/interview`,
    method: 'get',
    params
  })
}
export function pageInterviewResult(params) {
  return request({
    url: `/interview/result`,
    method: 'get',
    params
  })
}
export function getSchedule(id) {
  return request({
    url: `/interview/${id}`,
    method: 'get'
  })
}
export function queryResultDetial(id) {
  return request({
    url: `/interview/result/detail/${id}`,
    method: 'get'
  })
}
export function saveInterview(data) {
  return request({
    url: `/interview`,
    method: 'post',
    data
  })
}

export function modifyInterview(data) {
  return request({
    url: `/interview`,
    method: 'put',
    data
  })
}
