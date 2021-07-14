import { login } from '@/apis/user/mutation'
import { getUserProfile } from '@/apis/user/query'
import { LoginReq, UserModel } from '@/apis/user/types'
import { STORE_TOKEN } from '@/configs/store'
import { message } from 'antd'
import Router from 'next/router'
import create from 'zustand'
import { devtools } from 'zustand/middleware'

type GlobalUser = {
  /**
   * 用户数据
   */
  user?: UserModel

  /**
   * 清理用户信息
   */
  handleClear: () => void

  /**
   * 处理用户登录
   */
  handleLogin: typeof login

  /**
   * 处理用户登出
   * @description 不需要联网
   * @param isKickout 是否被踢出
   */
  handleLogout: (isKickout?: boolean) => void

  /**
   * 获取用户最新信息
   */
  getUserInfo: typeof getUserProfile
}

export const useUser = create<GlobalUser>(devtools(set => {
  const handleClear = () => {
    set({ 
      user: undefined,
    })
  }

  const handleLogin = async (req: LoginReq) => {
    const resp = await login(req)

    if (200 === resp.code && resp.data) {
      message.success('成功登录 🎉🎉🎉')
      // 缓存并持久化数据
      localStorage.setItem(STORE_TOKEN, resp.data.token)
      set({
        user: resp.data.user,
      })
      // 跳转至首页
      Router.replace('/')
    }

    return resp
  }

  const handleLogout = (isKickout = true) => {
    if (isKickout) {
      message.error('您的登录已过期，请重新登录')
    } else {
      message.success('您已登出 👋👋👋')
    }
    // 清理缓存和持久化的数据
    localStorage.removeItem(STORE_TOKEN)
    Router.replace('/login')
    handleClear()
  }

  const getUserInfo = async () => {
    const resp = await getUserProfile()
    if (resp.data) {
      set({
        user: resp.data.user,
      })
    } else if (resp.code !== 401) {
      // 获取不到用户信息，判定为登出
      // 跳过 401 判断是因为已经在中间件中判断过了
      handleLogout()
    }
    return resp
  }

  return {
    handleClear,
    handleLogin,
    handleLogout,
    getUserInfo,
    // 启动应用时，用户信息是空的
    // 因此，也可以将空信息作为信息加载中的标识
    user: undefined,
    sideMenus: undefined
  }
}))