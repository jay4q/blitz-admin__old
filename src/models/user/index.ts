import { login } from '@/apis/user/mutation'
import { getUserProfile } from '@/apis/user/query'
import { LoginReq, UserModel } from '@/apis/user/types'
import { STORE_TOKEN } from '@/configs/store'
import { message } from 'antd'
import Router from 'next/router'
import create from 'zustand'
import { devtools } from 'zustand/middleware'
import { getUserStore } from './helper'

type GlobalUser = {
  /**
   * @description 管理员个人资料；内容不存在时，也可以作为正在加载中的标识符
   */
  user?: UserModel

  /**
   * @description 当前管理员可用的侧边栏
   */
  sideMenus: MenuModel[]

  /**
   * @description 清理用户信息
   */
  handleClear: () => void

  /**
   * @description 处理用户登录
   */
  handleLogin: typeof login

  /**
   * @description 处理用户登出；无需联网
   * @param isKickout 是否被踢出
   */
  handleLogout: (isKickout?: boolean) => Promise<void>

  /**
   * @description 获取用户最新信息
   */
  getUserInfo: typeof getUserProfile
}

const USER_INITIAL_VALUES = {
  user: undefined,
  sideMenus: [],
}

export const useUser = create<GlobalUser>(devtools(set => {
  const handleClear = () => {
    set(USER_INITIAL_VALUES)
  }

  const handleLogin = async (req: LoginReq) => {
    const resp = await login(req)

    if (200 === resp.code && resp.data) {
      message.success('成功登录 🎉🎉🎉')
      // 缓存并持久化数据
      const { token, ...restData } = resp.data
      localStorage.setItem(STORE_TOKEN, resp.data.token)
      set(getUserStore(restData))
      // 跳转至首页
      await Router.replace('/')
    }

    return resp
  }

  const handleLogout = async (isKickout = true) => {
    if (isKickout) {
      message.error('您的登录已过期，请重新登录')
    } else {
      message.success('您已登出 👋👋👋')
    }
    // 清理缓存和持久化的数据
    localStorage.removeItem(STORE_TOKEN)
    await Router.replace('/login')
    handleClear()
  }

  const getUserInfo = async () => {
    const resp = await getUserProfile()
    if (resp.data) {
      set(getUserStore(resp.data))
    } else if (resp.code !== 401) {
      // 获取不到用户信息，判定为登出
      // 跳过 401 判断是因为已经在中间件中判断过了
      await handleLogout()
    }
    return resp
  }

  return {
    handleClear,
    handleLogin,
    handleLogout,
    getUserInfo,
    ...USER_INITIAL_VALUES,
  }
}))