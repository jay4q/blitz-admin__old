import { LoginReq, LoginResp } from './types'
import { tcbRequest } from '@/utils/tcbRequest'

/**
 * 用户登录
 * @param req 
 */
export const login = async (req: LoginReq) => {
  const resp = await tcbRequest<LoginResp>('/user/login', {
    data: req,
    method: 'POST'
  })
  return resp
}