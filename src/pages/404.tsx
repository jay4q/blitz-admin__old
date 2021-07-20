import { FunctionComponent } from 'react'
import { Empty, Button } from 'antd'
import { useRouter } from 'next/router'

const Index: FunctionComponent = () => {
  const router = useRouter()

  return (
    <Empty
      className='!mt-[15%]'
      description={
        <p className='text-gray-400'>找不到你要的内容</p>
      }
    >
      <Button type='default' onClick={() => router.replace('/')}>返回首页</Button>
    </Empty>
  )
}

export default Index