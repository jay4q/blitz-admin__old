export interface UserModel extends BaseModel {
  username: string
  // todo: 根据未来需求，应该还有更多，包括LOGO、地址、介绍等等
}

export type LoginReq = {
  username: string
  password: string
}

export type GetUserProfileResp = IResponse<{
  user: UserModel
}>

export type LoginResp = IResponse<{
  token: string
  user: UserModel
}>