import { message } from 'antd'
import { createRef, InputHTMLAttributes, PureComponent } from 'react'
import { RiVideoLine, RiLoader5Line } from 'react-icons/ri'
import { uploadVideo } from '../helpler'

type Props = {
  /**
   * 音视频上传后的云存储链接
   */
  onChange: (cloudUrl: string) => void
}

type State = {
  loading: boolean
}

/**
 * 富文本用的视频/音频上传工具
 */
export class VideoUploader extends PureComponent<Props, State> {
  readonly state = { loading: false }
  private inputRef = createRef<HTMLInputElement>()

  onSelect: InputHTMLAttributes<HTMLInputElement>['onChange'] = async e => {
    if (e.target.files?.length !== 1) {
      message.info('已经取消选择')
      return
    }

    // 开始处理
    let hide = message.loading('正在上传', 0)
    this.setState({ loading: true })

    try {
      const filePath = await uploadVideo(e.target.files[0])

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
        input.click()
      }
    }
  }

  render() {
    const { loading } = this.state

    return (
      <>
        <button type='button' data-title='音视频上传' className='control-item button' onClick={this.onSelectTrigger}>
          {
            loading ?
              <RiLoader5Line className='bfi-list text-lg animate-spin' /> : <RiVideoLine className='bfi-list text-lg' />
          }
        </button>
        <input ref={this.inputRef} type='file' accept='video/*,audio/*' className='hidden' onChange={this.onSelect} />
      </>
    )
  }
}