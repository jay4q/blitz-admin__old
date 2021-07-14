import Head from 'next/head'
import { Fragment, FunctionComponent, useState } from 'react'
import dynamic from 'next/dynamic'
import {Button} from 'antd'

const Editor = dynamic(
  // @ts-ignore
  () => import('@/components/form/Editor').then(mod => mod.Editor),
  { ssr: false }
)

/**
 * 首页
 */
const Page: FunctionComponent = () => {
  const [value, setValue] = useState('')

  return (
    <Fragment>
      <Head>
        <title>首页</title>
      </Head>
      <Button className='mb-6' onClick={() => console.log(value)}>看下结果</Button>
      <Editor value={value} onChange={setValue}></Editor>
    </Fragment>
  )
}

export default Page