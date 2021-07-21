import { message } from 'antd'
import { createRef, InputHTMLAttributes, PureComponent } from 'react'
import { RiImage2Line, RiLoader5Line, RiVideoLine } from 'react-icons/ri'
import { uploadImage, uploadVideo } from '../helpler'

type Props = {
  /**
   * 上传类型：图片或多媒体文件（音视频）
   */
  type: 'image' | 'media'

  /**
   * 音视频上传后的云存储链接
   */
  onChange: (cloudUrl: string) => void
}

type State = {
  loading: boolean
}

/**
 * 富文本编辑器定制的多媒体上传组件
 */
export class EditorUploader extends PureComponent<Props, State> {
  readonly state = { loading: false }
  private inputRef = createRef<HTMLInputElement>()

  onSelect: InputHTMLAttributes<HTMLInputElement>['onChange'] = async e => {
    if (e.target.files?.length !== 1) {
      message.info('已经取消选择')
      return
    }

    // 开始处理
    let hide = message.loading('正在上传文件', 0)
    this.setState({ loading: true })

    try {
      const filePath = this.props.type === 'image' ? await uploadImage(e.target.files[0]) : await uploadVideo(e.target.files[0])

      if (typeof filePath === 'string') {
        message.success('上传成功🎉🎉🎉')
        this.props.onChange(filePath)
      }
    } catch (e) {
      message.error(e.message || '上传失败，请稍后再试')
    }

    // 记得结束加载
    hide()
    this.setState({ loading: false })
  }

  onSelectTrigger = () => {
    if (!this.state.loading) {
      const input = this.inputRef.current
      if (input) {
        // 清空选中的内容，这样可以重复上传
        input.value = ''
        input.click()
      }
    }
  }

  render() {
    const isImage = this.props.type === 'image'

    return (
      <>
        <button type='button' data-title={isImage ? '图片上传' : '音视频上传'} className='control-item button' onClick={this.onSelectTrigger}>
          {
            this.state.loading ?
              <RiLoader5Line className='bfi-list text-lg animate-spin' /> :
              isImage ?
                <RiImage2Line className='bfi-list text-lg' /> :
                <RiVideoLine className='bfi-list text-lg' />
          }
        </button>
        <input ref={this.inputRef} type='file' accept={isImage ? 'image/*' : 'video/*,audio/*'} className='hidden' onChange={this.onSelect} />
      </>
    )
  }
}