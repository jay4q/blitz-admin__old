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
  _id: string
  created_at: Date
  updated_at: Date
  deleted_at: Date
}

interface MenuModel {
  path: string
  name: string
  icon?: import('react-icons').IconType
  // ! 这里最多一层子目录即可
  children?: MenuModel[]
}