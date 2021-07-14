import { request } from '@/utils/request'
import { GetUserProfileResp } from './types'

/**
 * 获取当前用户信息
 */
export const getUserProfile = async () => {
  const resp = await request.get<GetUserProfileResp>('/admin/user/profile')
  return resp
}