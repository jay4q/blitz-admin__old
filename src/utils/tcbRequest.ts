import { businessErrorHandler, request } from './request'
import { RequestOptionsInit } from 'umi-request'
import { getCloudBaseApp } from './cloudbase'
import { message } from 'antd'
import { HEADER_AUTH, STORE_TOKEN } from '@/configs/store'

const callFunction = async <ResponseData = any>(url: string, options: RequestOptionsInit) => {
  try {
    const app = await getCloudBaseApp()
    const { data, headers, params, method = 'GET' } = options || {}

    const resp = await app?.callFunction({
      parse: true,
      name: process.env.NEXT_PUBLIC_TCB_FUNC_NAME || '',
      // @see https://docs.cloudbase.net/service/access-cloud-function.html#yun-han-shu-de-ru-can
      data: {
        body: data,
        httpMethod: method,
        queryStringParameters: params,
        path: `${process.env.NEXT_PUBLIC_TCB_FUNC_PATH}${url}`,
        // 加上业务鉴权信息
        headers: {
          ...(headers || {}),
          ...(() => {
            const token = localStorage.getItem(STORE_TOKEN)
            return typeof token === 'string' ? { [HEADER_AUTH]: token } : {}
          })()
        }
      }
    })

    if (resp?.result) {
      const res = resp.result as IResponse<ResponseData>
      businessErrorHandler(res)
      return res
    } else {
      throw new Error('无法处理的请求')
    }
  } catch (err) {
    message.error(err.message || '无法处理的请求')
    return {
      code: 500,
      message: err.message || '无法处理的请求'
    } as IResponse<ResponseData>
  }
}

/**
 * 合并云函数HTTP请求、云函数SDK请求
 * @param url 
 * @param options 
 */
 export const tcbRequest = async <ResponseData = any>(url: string, options?: RequestOptionsInit) => {
  const { data } = options || {}
  const body = typeof data === 'object' ? JSON.stringify(data) : data
  const finalOptions: RequestOptionsInit = { ...(options || {}), data: body }

  if (process.env.NEXT_PUBLIC_ENABLE_HTTP === 'true') {
    return await request<IResponse<ResponseData>>(url, finalOptions)
  } else {
    return await callFunction<ResponseData>(url, finalOptions)
  }
}