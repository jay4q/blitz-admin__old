import { PageLayout } from '@/layouts/PageLayout'
import { FunctionComponent } from 'react'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { UploaderProps } from '@/components/form/Uploader/types'

const Uploader = dynamic<UploaderProps>(
  () => import('@/components/form/Uploader').then(mod => mod.Uploader),
  { ssr: false }
)

/**
 * 项目概述
 */
const Page: FunctionComponent = () => {
  const [urls, setUrls] = useState<string[]>([])

  const onAppend = (url: string) => {
    setUrls(prev => [...prev, url])
  }

  const onRemove = (url: string) => {
    setUrls(prev => prev.filter(f => f !== url))
  }

  return (
    <PageLayout title='项目概述'>
      <Uploader fileList={urls} onAppend={onAppend} onRemove={onRemove} type='file' max={3} />
    </PageLayout>
  )
}

export default Page