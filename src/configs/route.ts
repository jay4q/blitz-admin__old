import { RiEyeLine, RiBookOpenLine, RiWindowLine, RiGitMergeLine } from 'react-icons/ri'

export const SIDE_MENUS: MenuModel[] = [
  {
    path: '/',
    name: '项目概述',
    icon: RiEyeLine,
  },
  {
    path: '/article',
    name: '文章管理',
    icon: RiWindowLine,
    required: 'article',
    children: [
      {
        path: '/article/menu',
        name: '菜单管理',
        icon: RiGitMergeLine,
      },
      {
        path: '/article',
        name: '文章列表',
        icon: RiBookOpenLine,
      }
    ]
  }
]