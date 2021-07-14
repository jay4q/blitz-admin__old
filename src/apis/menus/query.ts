import { MenuModel } from './types'
import { RiEyeLine, RiBookLine } from 'react-icons/ri'

export const MENUS: MenuModel[] = [
  {
    path: '/',
    name: '项目概述',
    icon: RiEyeLine,
  },
  {
    path: '/article',
    name: '文章管理',
    icon: RiBookLine
  }
]