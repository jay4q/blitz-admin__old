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
   * @description 当前已经上传的；如果只是单个文件，可以只传一个路径
   */
  fileList?: string | string[]

  /**
   * @description 更新图片列表
   */
  onChange: (newList: string[]) => void
}