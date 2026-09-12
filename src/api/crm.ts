import request from '@/utils/request'

// 线索
export const listClue = (params?: any) => {
  return request.get({ url: '/crm/clue/page', params })
}

export const addClue = (data: any) => {
  return request.post({ url: '/crm/clue/create', data })
}

export const updateClue = (data: any) => {
  return request.put({ url: '/crm/clue/update', data })
}

export const delClue = (ids: number[]) => {
  return request.delete({ url: `/crm/clue/delete`, params: { ids } })
}

// 联系人
export const listContact = (params?: any) => {
  return request.get({ url: '/crm/contact/page', params })
}

export const addContact = (data: any) => {
  return request.post({ url: '/crm/contact/create', data })
}

export const updateContact = (data: any) => {
  return request.put({ url: '/crm/contact/update', data })
}

export const delContact = (ids: number[]) => {
  return request.delete({ url: `/crm/contact/delete`, params: { ids } })
}

// 商机
export const listBusiness = (params?: any) => {
  return request.get({ url: '/crm/business/page', params })
}

export const addBusiness = (data: any) => {
  return request.post({ url: '/crm/business/create', data })
}

export const updateBusiness = (data: any) => {
  return request.put({ url: '/crm/business/update', data })
}

export const delBusiness = (ids: number[]) => {
  return request.delete({ url: `/crm/business/delete`, params: { ids } })
}

// 合同
export const listContract = (params?: any) => {
  return request.get({ url: '/crm/contract/page', params })
}

export const addContract = (data: any) => {
  return request.post({ url: '/crm/contract/create', data })
}

export const updateContract = (data: any) => {
  return request.put({ url: '/crm/contract/update', data })
}

export const delContract = (ids: number[]) => {
  return request.delete({ url: `/crm/contract/delete`, params: { ids } })
}

// 回款
export const listReceivable = (params?: any) => {
  return request.get({ url: '/crm/receivable/page', params })
}

export const addReceivable = (data: any) => {
  return request.post({ url: '/crm/receivable/create', data })
}

export const updateReceivable = (data: any) => {
  return request.put({ url: '/crm/receivable/update', data })
}

export const delReceivable = (ids: number[]) => {
  return request.delete({ url: `/crm/receivable/delete`, params: { ids } })
}

// 跟进记录
export const listFollowUp = (params?: any) => {
  return request.get({ url: '/crm/follow-up/record/page', params })
}

export const addFollowUp = (data: any) => {
  return request.post({ url: '/crm/follow-up/record/create', data })
}

// 客户统计
export const getCustomerStats = () => {
  return request.get({ url: '/crm/statistics/customer/summary' })
}

// 业绩统计
export const getPerformanceStats = (params?: any) => {
  return request.get({ url: '/crm/statistics/performance/summary', params })
}
