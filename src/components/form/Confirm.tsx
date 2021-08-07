import { FunctionComponent } from 'react'
import { Button, ButtonProps } from 'antd'
import { useRouter } from 'next/router'

interface Props {
  loading?: boolean
  onConfirm: ButtonProps['onClick']

  /**
   * @description 是否是更新操作
   * @default false
   */
  isPatch?: boolean
}

/**
 * @description 编辑页常用的确认、取消按钮
 */
export const Confirm: FunctionComponent<Props> = ({
  onConfirm,
  loading = false,
  isPatch = false
}) => {
  const { back } = useRouter()

  return (
    <div className='w-full flex flex-row justify-end'>
      <Button className='mr-4' onClick={back}>取消</Button>
      <Button loading={loading} type='primary' onClick={onConfirm}>{isPatch ? '更新' : '创建'}</Button>
    </div>
  )
}