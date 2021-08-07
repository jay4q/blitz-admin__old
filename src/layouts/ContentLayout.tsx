import { Head } from '@/components/Head'
import { Skeleton, Typography } from 'antd'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { FunctionComponent, HTMLAttributes } from 'react'
import { RiArrowLeftCircleLine } from 'react-icons/ri'

type Props = HTMLAttributes<HTMLDivElement> & {
  title: string
  desc?: string
  loading?: boolean
}

const { Title, Paragraph } = Typography

/**
 * @description 资源详情页常用布局
 */
export const ContentLayout: FunctionComponent<Props> = ({ title, desc, children, className, loading = false, ...restProps }) => {
  const { back } = useRouter()

  return (
    <>
      <Head title={title} />
      <div className='w-full py-4 px-6 bg-white'>
        <Title level={4} className='!mb-0'>{title}</Title>
        {
          desc && <Paragraph className='!mb-0 !mt-3'>{desc}</Paragraph>
        }
      </div>
      <div className='mx-6 my-3'>
        <button className='flex items-center p-0 cursor-pointer' onClick={back}>
          <RiArrowLeftCircleLine className='text-primary text-xl mr-2' />
          <span className='text-base font-bold'>返回</span>
        </button>
      </div>
      <div className={classNames('flex-auto flex-shrink-0 mx-6 p-6 bg-white', className)} {...restProps}>
        <div className='max-w-3xl mx-auto'>
          {
            !loading ? children : <Skeleton active />
          }
        </div>
      </div>
    </>
  )
}