import { PureComponent } from 'react'
import { Button, message, Upload, UploadProps } from 'antd'
import { RiAddLine, RiLoader5Line } from 'react-icons/ri'
import { UploadFile, UploadListType } from 'antd/lib/upload/interface'
import { uploadFile, uploadImage, uploadVideo } from '../helpler'
import { UploaderProps } from './types'
import { getCloudUrl } from '@/utils/cloudbase'
import qs from 'query-string'

type State = {
  /**
   * @description 是否正在上传；如果正在上传，则用户不可以再次选择上传
   */
  loading: boolean
}

/**
 * @description 图片、音视频、文件上传工具；支持多个
 */
export class Uploader extends PureComponent<UploaderProps, State> {
  readonly state: State = {
    loading: false
  }

  showLoading = () => {
    let hide = message.loading('正在上传文件', 0)
    this.setState({ loading: true })

    return hide
  }

  hideLoading = (hide: Function) => {
    hide()
    this.setState({ loading: false })
  }

  // 由于 disabled 会导致无法删除，因此如果文件数量受控，只是在用户点击上传时提示即可
  onBeforeUpload: UploadProps['beforeUpload'] = () => {
    const { fileList, max = 1 } = this.props
    const isLimited = fileList.length >= max

    if (isLimited) {
      message.error(`最多上传${max}个文件`)
    }

    return !isLimited
  }

  onUpload: UploadProps['customRequest'] = async (options) => {
    const { file } = options
    const { type } = this.props

    const hide = this.showLoading()

    try {
      if (!(file instanceof File)) {
        throw new Error('文件选择失败，请刷新后重试')
      }

      const uploader = (() => {
        switch (type) {
          case 'img':
            return uploadImage
          case 'audio':
          case 'video':
            return uploadVideo
          default:
            return uploadFile
        }
      })()
      const cloudUrl = await uploader(file as File)

      if (typeof cloudUrl === 'string') {
        message.success('文件上传成功🎉🎉🎉')
        this.props.onAppend(getCloudUrl(cloudUrl))
      }
    } catch (e) {
      message.error(e.message || '文件上传失败，请稍后再试')
    }

    this.hideLoading(hide)
  }

  onRemove: UploadProps['onRemove'] = async (file) => {
    if (file.url) {
      this.props.onRemove(file.url)
    }
  }

  renderButton = () => {
    const { loading } = this.state
    const actionText = loading ? '上传中...' : '点击上传'

    if (this.listType === 'picture-card') {
      return (
        <div>
          {
            loading ?
              <RiLoader5Line className='text-lg animate-spin' /> :
              <RiAddLine className='text-lg' />
          }
          <span className='block mt-1'>{actionText}</span>
        </div>
      )
    } else {
      return (
        <Button loading={loading}>{actionText}</Button>
      )
    }
  }

  get fileList(): UploadFile[] {
    const { fileList } = this.props

    return fileList.map(url => ({
      url,
      uid: url,
      status: 'done',
      name: (() => {
        const arr = url.split('?')
        if (arr.length !== 2) return url

        const search = qs.parse(arr[1])
        return search['name'] as string || url
      })(),
    }))
  }

  get accept() {
    const { type = 'img' } = this.props

    switch (type) {
      case 'img':
        return 'image/*'
      case 'video':
        return 'video/*'
      case 'audio':
        return 'audio/*'
      default:
        return '*'
    }
  }

  get listType(): UploadListType {
    const { type = 'img' } = this.props

    switch (type) {
      case 'img':
        return 'picture-card'
      default:
        return 'text'
    }
  }

  render() {
    const { loading } = this.state

    return (
      <Upload
        multiple={false}
        disabled={loading}
        accept={this.accept}
        fileList={this.fileList}
        listType={this.listType}
        customRequest={this.onUpload}
        beforeUpload={this.onBeforeUpload}
        onRemove={this.onRemove}
      >
        {
          this.renderButton()
        }
      </Upload>
    )
  }
}