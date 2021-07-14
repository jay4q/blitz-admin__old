import { message } from 'antd'
import { createRef, InputHTMLAttributes, PureComponent } from 'react'
import { RiImage2Line, RiLoader5Line } from 'react-icons/ri'
import { uploadImage } from '../helpler'

type Props = {
  /**
   * 图片上传后的云存储链接
   */
  onChange: (cloudUrl: string) => void
}

type State = {
  loading: boolean
}

/**
 * 富文本编辑器用的图片上传组件
 */
export class ImageUploader extends PureComponent<Props, State> {
  readonly state = { loading: false }
  private inputRef = createRef<HTMLInputElement>()

  onSelect: InputHTMLAttributes<HTMLInputElement>['onChange'] = async e => {
    if (e.target.files?.length !== 1) {
      message.info('已经取消图片选择')
      return
    }

    // 开始处理
    let hide = message.loading('正在上传图片', 0)
    this.setState({ loading: true })

    try {
      const filePath = await uploadImage(e.target.files[0])

      if (typeof filePath === 'string') {
        message.success('图片上传成功🎉🎉🎉')
        this.props.onChange(filePath)
      }
    } catch (e) {
      message.error(e.message || '图片上传失败，请稍后再试')
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
        <button type='button' data-title='图片上传' className='control-item button' onClick={this.onSelectTrigger}>
          {
            loading ?
              <RiLoader5Line className='bfi-list text-lg animate-spin' /> : <RiImage2Line className='bfi-list text-lg' />
          }
        </button>
        <input ref={this.inputRef} type='file' accept='image/*' className='hidden' onChange={this.onSelect} />
      </>
    )
  }
}