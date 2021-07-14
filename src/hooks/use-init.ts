import { useUser } from '@/models/user'
import { getCloudBaseApp } from '@/utils/cloudbase'
import { useBoolean } from 'ahooks'
import { useEffect } from 'react'

/**
 * 处理应用中的初始化事务
 */
export const useInit = () => {
  const [isFinishIniting, { setTrue }] = useBoolean(false)
  const { getUserInfo, handleLogout } = useUser()

  useEffect(() => {
    // ! 启动应用时处理一次，整个应用生命周期仅需一次，用于初始化用户数据
    (async () => {
      // 初始化腾讯云开发
      const isCloudbaseInit = await getCloudBaseApp()
      if (!isCloudbaseInit) {
        handleLogout()
      }

      // 初始化用户信息
      await getUserInfo()

      // 关闭加载状态
      setTimeout(() => {
        setTrue()
      }, 500)
    })()
  }, [])

  return isFinishIniting
}