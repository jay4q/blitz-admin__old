import { tcbRequest } from '@/utils/tcbRequest'
import { GetUserProfileResp } from './types'

/**
 * 获取当前用户信息
 */
export const getUserProfile = async () => {
  const resp = await tcbRequest<GetUserProfileResp>('/user/profile')
  return resp
}