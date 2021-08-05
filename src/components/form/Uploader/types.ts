export type UploaderProps = {
  /**
   * @description 最多可以上传多少张图片
   * @default 1
   */
  max?: number

  /**
   * @description 文件上传类型
   * @default img
   */
  type?: 'img' | 'audio' | 'video' | 'file'

  /**
   * @description 当前已经上传的
   */
  fileList: string[]

  /**
   * @description 新文件上传成功后的回调
   */
  onAppend: (url: string) => void

  /**
   * @description 文件删除后的回调
   */
  onRemove: (url: string) => void
}