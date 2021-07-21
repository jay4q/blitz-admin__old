import { RiEyeLine, RiBookOpenLine, RiWindowLine, RiGitMergeLine } from 'react-icons/ri'

export const SIDE_MENUS: MenuModel[] = [
  {
    path: '/',
    name: '项目概述',
    icon: RiEyeLine,
  },
  {
    path: '/portal',
    name: '门户网站管理',
    icon: RiWindowLine,
    children: [
      {
        path: '/portal/menu',
        name: '菜单管理',
        icon: RiGitMergeLine,
      },
      {
        path: '/portal/article',
        name: '文章列表',
        icon: RiBookOpenLine,
      }
    ]
  }
]