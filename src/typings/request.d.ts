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