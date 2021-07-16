type IResponse<Data = any> = {
  code: number
  message: string
  data?: Data
}

type IPaginationReq = {
  current: number
  pageSize: number
}

type IPaginationResp<Item = any> = {
  total: number
  list: Item[]
}

interface BaseModel {
  id: number
  createdAt: Date
  updatedAt: Date
  deletedAt: Date
}

interface MenuModel {
  path: string
  name: string
  icon?: import('react-icons').IconType
  // ! 这里最多一层子目录即可
  children?: MenuModel[]
}