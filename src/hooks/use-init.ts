import { useUser } from '@/models/user'
import { getCloudBaseApp } from '@/utils/cloudbase'
import { useBoolean } from 'ahooks'
import { useEffect } from 'react'

/**
 * @description 处理应用中的初始化事务
 */
export const useInit = () => {
  const [isFinishIniting, { setTrue: finishLoading }] = useBoolean(false)
  const { getUserInfo, handleLogout } = useUser()

  useEffect(() => {
    // ! 启动应用时处理一次，整个应用生命周期仅需一次，用于初始化用户数据
    (async () => {
      // 初始化腾讯云开发
      const isCloudbaseInit = await getCloudBaseApp()
      if (!isCloudbaseInit) {
        await handleLogout()
      }
      // 初始化用户信息
      await getUserInfo()

      finishLoading()
    })()
  }, [])

  return isFinishIniting
}