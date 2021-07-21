import 'nprogress/nprogress.css'
import '@/styles/global.css'
require('@/styles/antd.less')
require('@/styles/antd-css.less')
import { useGlobalLoading } from '@/hooks'
import { AppProps } from 'next/app'
import { LayoutWrapper } from '@/layouts'
import Head from 'next/head'
import { APP_NAME } from '@/configs/meta'

export default function App({ Component, pageProps }: AppProps) {
  useGlobalLoading()

  return (
    <>
      <Head>
        <title>{APP_NAME}</title>
      </Head>
      <LayoutWrapper>
        <Component {...pageProps} />
      </LayoutWrapper>
    </>
  )
}