import { LoginReq, LoginResp } from './types'
import { request } from '@/utils/request'

/**
 * 用户登录
 * @param req 
 */
export const login = async (req: LoginReq) => {
  const resp = await request.post<LoginResp>('/admin/user/login', {
    body: JSON.stringify(req)
  })
  return resp
}