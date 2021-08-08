import { GetUserProfileResp } from '@/apis/user/types'
import { SIDE_MENUS } from '@/configs/route'

/**
 * @description 是否是超级管理员
 * @param roles 
 */
 export const isSuper = (roles?: string[]) => roles?.some(role => role === '*')

/**
 * @description 根据角色权限，判断是否被授权
 * @param roles 
 * @param required 
 */
export const isAuthed = (roles: string[], required?: string) => {
  if (!required) return true
  if (isSuper(roles)) return true

  return roles.some(role => role === required)
}

/**
 * @description 获取当前用户角色权限，获取可用的侧边菜单
 * @param menus 
 * @param roles 
 */
export const getSideMenus = (menus: MenuModel[], roles: string[]) => {
  if (isSuper(roles)) {
    return menus
  }

  const res = menus.filter(menu => {
    // 路由不需要角色权限的情况
    if (!menu.required) {
      return true
    }

    // 需要权限的情况
    return roles.some(role => role === menu.required)
  })

  return res
}

/**
 * @description 生成管理员用户信息
 * @param resp 
 */
export const getUserStore = (resp: GetUserProfileResp) => ({
  ...resp,
  sideMenus: getSideMenus(SIDE_MENUS, resp.user.roles)
})