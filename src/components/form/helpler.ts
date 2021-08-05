import { IMAGE_COMPRESS_THRESHOLD, VIDEO_MAX_THRESHOLD } from '@/configs/component'
import { uploadFile as upload } from '@/utils/cloudbase'
import { convertBlob2File } from '@/utils/utils'
import { compressAccurately } from 'image-conversion'
import Vibrant from 'node-vibrant'
import qs from 'query-string'
import { getBlurhash } from 'blitz-libs'

type UploadHandler = (file: File) => Promise<string>

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
 * @description 图像优化策略
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
 * @description 处理图片上传；包含一系列操作，压缩、获取模糊值、获取主色、获取原始宽高、上传至腾讯云存储
 * @param file 
 */
export const uploadImage: UploadHandler = async file => {
  const image = await getImageElement(file)
  const compressedFile = await handleCompress(file, image, file.name)
  const optmization = await handleOptimization(image)
  const cloudUrl = await upload(compressedFile as File)

  const search = qs.stringify({ ...optmization, width: image.width, height: image.height }, { skipNull: true })

  return cloudUrl + '?' + search
}

/**
 * @description 处理音视频上传；不支持上传大文件
 * @param file 
 */
export const uploadVideo: UploadHandler = async file => {
  if (file.size > VIDEO_MAX_THRESHOLD) {
    throw new Error(`禁止上传超过${Math.floor(VIDEO_MAX_THRESHOLD / (1024 * 1024))}MB的文件`)
  }

  const video = document.createElement('video')
  video.preload = 'metadata'
  video.src = URL.createObjectURL(file)

  // 获取音视频时长
  const duration = await new Promise<number>((resolve) => {
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src)
      resolve(video.duration)
    }

    video.onerror = () => {
      resolve(0)
    }
  })

  const cloudUrl = await upload(file)
  const search = qs.stringify({ duration, name: file.name }, { skipNull: true })

  return cloudUrl + '?' + search
}

/**
 * @description 上传附件
 * @param file 
 */
export const uploadFile: UploadHandler = async file => {
  const cloudUrl = await upload(file)
  const search = qs.stringify({ name: file.name }, { skipNull: true })

  return cloudUrl + '?' + search
}