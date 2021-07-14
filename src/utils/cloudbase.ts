import cloudbase from '@cloudbase/js-sdk'
import dayjs from 'dayjs'
import { v4 as uuid } from 'uuid'

let _app: cloudbase.app.App
let _auth: cloudbase.auth.App

/**
 * 获取云开发实例
 * @description 目前业务需求，只需要匿名登录即可，因为用户信息和认证由业务平台维护
 */
export const getCloudBaseApp = async () => {
  try {
    if (!_app) {
      const envId = process.env.NEXT_PUBLIC_TCB_ENV_ID
      if (!envId) {
        throw new Error('请检查 NEXT_PUBLIC_TCB_ENV_ID 是否填写或是否有效')
      }
      _app = cloudbase.init({ env: envId })
    }

    if (!_auth) {
      _auth = _app.auth({ persistence: 'local' })
    }

    // 使用匿名登录
    const loginState = await _auth.getLoginState()
    if (!loginState?.isAnonymousAuth) {
      await _auth.anonymousAuthProvider().signIn()
    }

    return _app
  } catch (e) {
    console.error(e.message)
    return undefined
  }
}

/**
 * 获取 http 鉴权头部
 * @description http 请求时使用
 * @see https://cloud.tencent.com/document/product/876/44225
 */
export const getAuthHeader = async () => {
  await getCloudBaseApp()
  const authHeader = await _auth.getAuthHeaderAsync()
  return authHeader || {}
}

/**
 * 上传文件
 * @param file 
 */
export const uploadFile = async (file: File) => {
  const app = await getCloudBaseApp()
  if (!app) return undefined

  const fileType = /(?<=\.)[A-Za-z0-9]{1,}/.exec(file.name)
  if (!fileType) return undefined

  const res = await app!
    .uploadFile({
      cloudPath: `uploads/${dayjs().format('YYYY-MM-DD')}/${uuid().replaceAll('-', '')}.${fileType[0]}`,
      // @ts-ignore
      filePath: file
    })

  return res?.fileID
}

/**
 * 获取云存储的访问链接
 * @param url 云存储的特定url
 */
export const getCloudUrl = (url?: string) => {
  if (!url) return ''

  if (!url.startsWith("cloud://")) {
    return url
  }

  const re = /cloud:\/\/.*?\.(.*?)\/(.*)/
  const result = re.exec(url) as any
  return `https://${result[1]}.tcb.qcloud.la/${result[2]}`
}