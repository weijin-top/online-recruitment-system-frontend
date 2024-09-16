
import request from '@/utils/request'

export function pageResumeDelivery(params) {
  return request({
    url: `/resumeDelivery`,
    method: 'get',
    params
  })
}

export function pageDelivery(params) {
  return request({
    url: `/resumeDelivery/delivery`,
    method: 'get',
    params
  })
}

export function queryDeliveryCount() {
  return request({
    url: `/resumeDelivery/count`,
    method: 'get'
  })
}

export function recruiterQueryDeliveryCount() {
  return request({
    url: `/resumeDelivery/recruiter/count`,
    method: 'get'
  })
}

export function saveResumeDelivery(positionId) {
  return request({
    url: `/resumeDelivery/${positionId}`,
    method: 'post'
  })
}

export function modifyResumeDeliveryStatus(id, status) {
  return request({
    url: `/resumeDelivery/${id}/${status}`,
    method: 'put'
  })
}
