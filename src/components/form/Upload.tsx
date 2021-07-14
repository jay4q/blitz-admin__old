import { Button, message } from 'antd'
import { createRef, InputHTMLAttributes, PureComponent } from 'react'
import { uploadImage } from './helpler'

type Props = {
  /**
   * 当前选中的链接
   */
  value?: string

  /**
   * 更新上传后的链接
   */
  onChange: (value: string) => void
}

type State = {
  loading: boolean
}

export class Upload extends PureComponent<Props, State> {
  readonly state = {
    loading: false
  }

  private inputRef = createRef<HTMLInputElement>()

  onSelect: InputHTMLAttributes<HTMLInputElement>['onChange'] = async e => {
    const { files } = e.target

    if (files?.length !== 1) {
      message.info('已经取消图片选择')
      return
    }

    try {
      this.setState({ loading: true })
      const filePath = await uploadImage(files[0])

      if (typeof filePath === 'string') {
        message.success('图片上传成功🎉🎉🎉')
        this.props.onChange(filePath)
      }
    } catch (e) {
      message.error(e.message || '图片上传失败，请稍后再试')
    }

    // 记得结束加载
    this.setState({ loading: false })
  }

  onSelectTrigger = () => {
    const input = this.inputRef.current
    if (input) {
      input.click()
    }
  }

  render() {
    const { loading } = this.state

    return (
      <>
        <Button type='primary' loading={loading} onClick={this.onSelectTrigger}>上传图片</Button>
        <input ref={this.inputRef} type='file' accept='image/*' className='hidden' onChange={this.onSelect} />
      </>
    )
  }
}