import { IconType } from 'react-icons'

export type MenuModel = {
  path: string
  name: string
  icon?: IconType
  // ! 这里最多一层子目录即可
  children?: MenuModel[]
}