import { FunctionComponent } from 'react'
import NextHead from 'next/head'
import { APP_NAME } from '@/configs/meta'

type Props = {
  title?: string
}

/**
 * @description 网页标题
 */
export const Head: FunctionComponent<Props> = ({ title }) => {
  // todo: 可以支持一下直接读取菜单的标题
  const menuTitle = '内容管理'

  return (
    <NextHead>
      <title>{title || menuTitle}｜{APP_NAME}</title>
    </NextHead>
  )
}