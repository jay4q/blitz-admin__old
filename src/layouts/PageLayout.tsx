import { Head } from '@/components/Head'
import { Typography } from 'antd'
import classNames from 'classnames'
import { FunctionComponent, HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLDivElement> & {
  title: string
  desc?: string
  theme?: 'card' | 'default'
}

const { Title, Paragraph } = Typography

/**
 * 常用的页面布局
 */
export const PageLayout: FunctionComponent<Props> = ({ title, desc, children, className, theme = 'card', ...restProps }) => {
  return (
    <>
      <Head title={title} />
      <div className='w-full py-4 px-6 bg-white'>
        <Title level={4} className='!mb-0'>{title}</Title>
        {
          desc && <Paragraph className='!mb-0 !mt-3'>{desc}</Paragraph>
        }
      </div>
      <div className={classNames('flex-auto flex-shrink-0 m-6 mb-0', theme === 'card' && 'p-6 bg-white', className)} {...restProps}>
        {children}
      </div>
    </>
  )
}