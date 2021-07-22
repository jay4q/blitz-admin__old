import { extend, ResponseError } from 'umi-request'
import { HEADER_AUTH, STORE_TOKEN } from '@/configs/store'
import { message } from 'antd'
import { unstable_batchedUpdates } from 'react-dom'
import { useUser } from '@/models/user'
import { getAuthHeader } from './cloudbase'

const HTTP_CODE_MAP: { [key in string]: string } = {
  "400": "请求内容有误",
  "401": "您尚未登录",
  "403": "抱歉，您没有访问权限",
  "404": "无法处理的请求",
  "406": "请求的格式有误",
  "408": "请求超时，请稍后再试",
  "410": "资源已被删除",
  "422": "发生验证错误",
  "500": "服务器出错",
  "502": "网关错误",
  "503": "服务不可用，服务器暂时过载或维护",
  "504": "网关超时",
  "999": "网络连接出错，请稍后重试"
}

const errorHandler = (e: ResponseError<IResponse>): IResponse => {
  if (e.response) {
    return {
      data: e.data.data,
      code: e.data.code || e.response.status,
      message: e.data.message || HTTP_CODE_MAP[`${e.response.status}`] || '服务器异常，请稍后再试'
    }
  } else {
    // 请求发不出去
    message.error(HTTP_CODE_MAP['999'])
    return {
      code: 999,
      message: HTTP_CODE_MAP['999']
    }
  }
}

/**
 * 业务异常处理
 * @param resp 
 */
export const businessErrorHandler = <ResponseData = any>(resp: IResponse<ResponseData>) => {
  if (200 !== resp.code) {
    if (401 === resp.code) {
      unstable_batchedUpdates(() => {
        useUser.getState().handleLogout()
      })
    } else {
      // 普通错误，弹框提示即可
      message.error(resp.message)
    }
  }
}

export const request = extend({
  prefix: process.env.NEXT_PUBLIC_TCB_HTTP_API,
  headers: {
    // 🤔️ umi-request 这里有点问题，默认是 'text/plain'，但文档里说默认是 'application/json'
    'Content-Type': 'application/json;charset=UTF-8',
  },
  errorHandler,
})

// 带上请求鉴权信息
request.use(async (ctx, next) => {
  const token = localStorage.getItem(STORE_TOKEN)
  if (typeof token === 'string') {
    // @ts-ignore
    ctx.req.options.headers[HEADER_AUTH] = token
  }

  ctx.req.options.headers = {
    ...ctx.req.options.headers,
    ...await getAuthHeader()
  }

  await next()
})

request.use(async (ctx, next) => {
  await next()
  businessErrorHandler(ctx.res as IResponse)
})