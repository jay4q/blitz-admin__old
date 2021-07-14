import { useInit } from '@/hooks'
import { Spin } from 'antd'
import { useRouter } from 'next/router'
import { FunctionComponent } from 'react'
import { Dashboard } from './Dashboard'

/**
 * 统一的布局配置
 */
export const LayoutWrapper: FunctionComponent = ({ children }) => {
  const { pathname } = useRouter()
  const isFinishIniting = useInit()

  if (!isFinishIniting) {
    return (
      <div className='fixed w-full h-full inset-0 flex items-center justify-center'>
        <Spin size='large' />
      </div>
    )
  }

  // 登录页有自己独立的布局方式
  if (pathname === '/login') {
    return <>{children}</>
  }

  // 其它管理页均使用统一布局
  return <Dashboard>{children}</Dashboard>
}