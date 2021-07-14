import { LoginReq } from '@/apis/user/types'
import { Fragment, FunctionComponent } from 'react'
import { useForm } from 'react-hook-form'
import { useBoolean } from 'ahooks'
import { APP_NAME, APP_DESC } from '@/configs/meta'
import Head from 'next/head'
import { Footer } from '@/components/Footer'
import FormItem from 'antd/lib/form/FormItem'
import { Input, Button } from 'antd'
import { useUser } from '@/models/user'

/**
 * 登录页
 */
const Page: FunctionComponent = () => {
  const { handleLogin } = useUser()
  const [loading, { setTrue, setFalse }] = useBoolean()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginReq>()

  const onSubmit = async (req: LoginReq) => {
    setTrue()
    const resp = await handleLogin(req)
    if (resp.code !== 200) {
      setFalse()
    }
  }

  return (
    <Fragment>
      <Head>
        <title>用户登录</title>
      </Head>
      <div className='w-full h-screen bg-[#f0f2f5] flex flex-col items-center  justify-between'>
        <div className='flex flex-col h-full items-center pt-36'>
          <div className='flex flex-col items-center min-w-[420px] px-6 py-16 bg-white rounded-lg'>
            {
              // todo: logo 没给到
            }
            <h1 className='text-4xl tracking-wide'>🎨 {APP_NAME}</h1>
            <p className='text-sm text-gray-400 tracking-wide'>{APP_DESC}</p>
            <h2 className='mt-10 mb-6 text-lg'>账户密码登录</h2>
            <div className='w-full flex-grow'>
              <FormItem validateStatus={errors.username && 'error'} help={errors.username && '😉 请填写您的用户名'}>
                <Input
                  size='large'
                  placeholder='用户名'
                  {...register('username', { required: true, pattern: /^[a-zA-Z0-9_-]{4,16}$/ })}
                />
              </FormItem>
              <FormItem validateStatus={errors.password && 'error'} help={errors.password && '🤫 请填写正确格式的密码'}>
                <Input.Password
                  size='large'
                  placeholder='密码'
                  {...register('password', { required: true, pattern: /^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])(?=\S*[!@#$%^&*? ])\S*$/ })}
                />
              </FormItem>
              <Button
                loading={loading}
                className='w-full mt-4'
                type='primary'
                size='large'
                onClick={handleSubmit(onSubmit)}
              >登录</Button>
            </div>
          </div>
          <div className='flex-grow'></div>
          <Footer />
        </div>
      </div>
    </Fragment>
  )
}

export default Page