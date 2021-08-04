import { IMAGE_COMPRESS_THRESHOLD, VIDEO_MAX_THRESHOLD } from '@/configs/component'
import { uploadFile } from '@/utils/cloudbase'
import { convertBlob2File } from '@/utils/utils'
import { compressAccurately } from 'image-conversion'
import Vibrant from 'node-vibrant'
import qs from 'query-string'
import { getBlurhash } from 'blitz-libs'

/**
 * 根据图片文件得到图片标签
 * @param file 
 */
const getImageElement = async (file: File) => {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = (...args) => reject(args)
    img.src = URL.createObjectURL(file)
  })

  return image
}

/**
 * 图像压缩
 * @param file 
 * @param image 
 * @param filename 图片文件名
 */
const handleCompress = async (file: File, image: HTMLImageElement, filename: string) => {
  let width, height = 0

  if (image.width > IMAGE_COMPRESS_THRESHOLD) {
    width = IMAGE_COMPRESS_THRESHOLD
    height = image.height * IMAGE_COMPRESS_THRESHOLD / image.width
  } else {
    width = image.width
    height = image.height
  }

  const blob = await compressAccurately(file, {
    width,
    height,
    size: 300,
  })

  return blob instanceof File ? blob : convertBlob2File(blob, filename)
}

/**
 * 图像优化策略
 * @param image 
 */
const handleOptimization = async (image: HTMLImageElement) => {
  // 获取模糊值
  const { hash } = await getBlurhash(image) || {}
  // 获取主色
  const colors = await Vibrant.from(image).getSwatches()
  const color = colors.Vibrant?.getHex()

  return { hash, color }
}

/**
 * 处理图片上传
 * @description 包含一系列操作，压缩、获取模糊值、获取主色、获取原始宽高、上传至腾讯云存储
 * @param file 
 */
export const uploadImage = async (file: File) => {
  const image = await getImageElement(file)
  const compressedFile = await handleCompress(file, image, file.name)
  const optmization = await handleOptimization(image)
  const cloudUrl = await uploadFile(compressedFile as File)
  // 合并有效参数
  const search = qs.stringify({ ...optmization, width: image.width, height: image.height }, { skipNull: true })

  return cloudUrl + '?' + search
}

/**
 * 处理音视频上传
 * @description 大文件暂时不允许上传
 * @param file 
 */
export const uploadVideo = async (file: File) => {
  if (file.size > VIDEO_MAX_THRESHOLD) {
    throw new Error(`禁止上传超过${Math.floor(VIDEO_MAX_THRESHOLD / (1024 * 1024))}MB的文件`)
  }

  const video = document.createElement('video')
  video.preload = 'metadata'
  video.src = URL.createObjectURL(file)

  // 时长
  const duration = await new Promise<number>((resolve) => {
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src)
      resolve(video.duration)
    }

    video.onerror = () => {
      resolve(0)
    }
  })

  // 腾讯云路径
  const cloudUrl = await uploadFile(file)

  // 文件名称，去除后缀
  const filename = /.{1,}(?=\.)/.exec(file.name)
  if (!filename) throw new Error(`无法获取音视频名称`)

  // 合并有效参数 命名和时长
  const search = qs.stringify({ duration, name: filename[0] }, { skipNull: true })

  return cloudUrl + '?' + search
}