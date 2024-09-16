
import request from '@/utils/request'

export function pageCompanies(params) {
  return request({
    url: '/company/companies',
    method: 'get',
    params
  })
}

export function auditCompany(id, status) {
  return request({
    url: `/company/audit/${id}/${status}`,
    method: 'put'
  })
}

export function singleCompany(params) {
  return request({
    url: `/company/single`,
    method: 'get',
    params
  })
}

export function saveCompany(data) {
  return request({
    url: `/company`,
    method: 'post',
    data
  })
}

export function modifyCompany(data) {
  return request({
    url: `/company`,
    method: 'put',
    data
  })
}
