import { tcbRequest } from '@/utils/tcbRequest'
import { UserModel, UserRoleModel } from '../user/types'

/**
 * @description 获取当前馆内所有管理员
 */
export const getAll = async () => {
  const resp = await tcbRequest<UserModel[]>('/admin-user/')
  return resp
}

/**
 * @description 获取一个管理员
 * @param uid 管理用户 id
 */
export const getOne = async (uid: string) => {
  const resp = await tcbRequest<{ user: UserModel, roles: UserRoleModel[] }>(`/admin-user/${uid}`)
  return resp
}

export const getRoles = async () => {
  const resp = await tcbRequest<{ user: undefined, roles: UserRoleModel[] }>('/admin-user/roles')
  return resp
}