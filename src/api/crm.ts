import request from '@/utils/request'

export interface Customer {
  id: number
  name: string
  mobile: string
  telephone: string
  level: string
  source: string
  status: string
}

export interface Clue {
  id: number
  name: string
  mobile: string
  source: string
  status: string
}

export interface Contact {
  id: number
  customerId: number
  customerName: string
  name: string
  role: string
  mobile: string
}

export interface Business {
  id: number
  name: string
  customerId: number
  customerName: string
  amount: number
  stage: string
  status: string
}

// 客户管理
export const listCustomer = (params?: any) => {
  return request.get({ url: '/crm/customer/page', params })
}

export const getCustomer = (id: number) => {
  return request.get({ url: '/crm/customer/get', params: { id } })
}

export const addCustomer = (data: any) => {
  return request.post({ url: '/crm/customer/create', data })
}

export const updateCustomer = (id: number, data: any) => {
  return request.put({ url: `/crm/customer/update/${id}`, data })
}

export const delCustomer = (ids: number | number[]) => {
  return request.delete({ url: `/crm/customer/delete/${ids}` })
}

// 线索管理
export const listClue = (params?: any) => {
  return request.get({ url: '/crm/clue/page', params })
}

export const addClue = (data: any) => {
  return request.post({ url: '/crm/clue/create', data })
}

export const updateClue = (id: number, data: any) => {
  return request.put({ url: `/crm/clue/update/${id}`, data })
}

export const delClue = (id: number) => {
  return request.delete({ url: `/crm/clue/delete/${id}` })
}

// 联系人管理
export const listContact = (params?: any) => {
  return request.get({ url: '/crm/contact/page', params })
}

export const addContact = (data: any) => {
  return request.post({ url: '/crm/contact/create', data })
}

export const updateContact = (id: number, data: any) => {
  return request.put({ url: `/crm/contact/update/${id}`, data })
}

export const delContact = (id: number) => {
  return request.delete({ url: `/crm/contact/delete/${id}` })
}

// 商机管理
export const listBusiness = (params?: any) => {
  return request.get({ url: '/crm/business/page', params })
}

export const addBusiness = (data: any) => {
  return request.post({ url: '/crm/business/create', data })
}

export const updateBusiness = (id: number, data: any) => {
  return request.put({ url: `/crm/business/update/${id}`, data })
}

export const delBusiness = (id: number) => {
  return request.delete({ url: `/crm/business/delete/${id}` })
}

// 合同管理
export const listContract = (params?: any) => {
  return request.get({ url: '/crm/contract/page', params })
}

export const addContract = (data: any) => {
  return request.post({ url: '/crm/contract/create', data })
}

export const updateContract = (id: number, data: any) => {
  return request.put({ url: `/crm/contract/update/${id}`, data })
}

export const delContract = (id: number) => {
  return request.delete({ url: `/crm/contract/delete/${id}` })
}

// 回款管理
export const listReceivable = (params?: any) => {
  return request.get({ url: '/crm/receivable/page', params })
}

export const addReceivable = (data: any) => {
  return request.post({ url: '/crm/receivable/create', data })
}

// 跟进记录
export const listFollowup = (params?: any) => {
  return request.get({ url: '/crm/followup/page', params })
}

export const addFollowup = (data: any) => {
  return request.post({ url: '/crm/followup/create', data })
}

// 统计
export const getCustomerSummary = (params?: any) => {
  return request.get({ url: '/crm/customer/summary', params })
}

export const getBusinessSummary = (params?: any) => {
  return request.get({ url: '/crm/business/summary', params })
}
