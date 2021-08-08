import { tcbRequest } from '@/utils/tcbRequest'
import { PostAdminUserReq } from './types'

/**
 * 新建一个管理员
 * @param req 
 */
export const postOne = async (req: PostAdminUserReq) => {
  const resp = await tcbRequest<string>('/admin-user/', {
    method: 'POST',
    data: req,
  })
  return resp
}

/**
 * 更新一个管理员
 * @param req 
 * @param uid 
 */
export const patchOne = async (req: Partial<PostAdminUserReq>, uid: string) => {
  const resp = await tcbRequest<string>(`/admin-user/${uid}`, {
    method: 'PATCH',
    data: req,
  })
  return resp
}
