import { patchOne } from '@/apis/admin-user/mutation'
import { getAll } from '@/apis/admin-user/query'
import { UserModel } from '@/apis/user/types'
import { PageLayout } from '@/layouts/PageLayout'
import { useUser } from '@/models/user'
import { isArrayEmpty } from '@/utils/utils'
import { useRequest } from 'ahooks'
import { Button, Divider, Table, Tag, Modal, ModalProps, Input, Form, message } from 'antd'
import FormItem from 'antd/lib/form/FormItem'
import dayjs from 'dayjs'
import Router, { useRouter } from 'next/router'
import { useState } from 'react'
import { FunctionComponent, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'

type PasswordModalProps = {
  uid: string
  username: string
  visible: boolean
  onClose: () => void
}

type PasswordFormType = {
  password: string
  confirmPassword: string
}

export const PasswordModal: FunctionComponent<PasswordModalProps> = ({ uid, username, visible, onClose }) => {
  const { reset, control, handleSubmit, getValues, formState: { errors } } = useForm<PasswordFormType>()

  const { loading: isSubmitting, run: submit } = useRequest(patchOne, {
    manual: true,
  })

  const onCancel: ModalProps['onCancel'] = () => {
    // 关闭后清空表单
    reset({})
    onClose()
  }

  const onSubmit = async (req: PasswordFormType) => {
    const resp = await submit({ password: req.password }, uid)
    if (resp.code === 200) {
      message.success(`已重置 ${username} 密码 🎉🎉🎉 `)
      reset({})
      onClose()
    }
  }

  return (
    <Modal
      visible={visible}
      title={`重置 ${username} 登录密码`}
      okText='确认重置'
      cancelText='取消'
      onCancel={onCancel}
      confirmLoading={isSubmitting}
      onOk={handleSubmit(onSubmit)}
    >
      <Form className='w-full' layout='vertical'>
        <FormItem label='登录密码' required validateStatus={errors.password && 'error'} help={errors.password && '密码至少包括1个大写字母，1个小写字母，1个数字，1个特殊字符'}>
          <Controller
            control={control}
            name='password'
            rules={{ required: true, pattern: /^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])(?=\S*[!@#$%^&*? ])\S*$/ }}
            render={({ field }) => (
              <Input.Password {...field} />
            )}
          />
        </FormItem>
        <FormItem label='确认密码' required validateStatus={errors.confirmPassword && 'error'} help={errors.confirmPassword && '请填写正确的密码'}>
          <Controller
            control={control}
            name='confirmPassword'
            // 和登录密码匹配即可
            rules={{ required: true, validate: value => getValues().password === value }}
            render={({ field }) => (
              <Input.Password {...field} />
            )}
          />
        </FormItem>
      </Form>
    </Modal>
  )
}

/**
 * @description 子用户管理
 */
const Page: FunctionComponent = () => {
  const router = useRouter()
  const { user } = useUser()
  const { loading, data } = useRequest(getAll)

  const list = useMemo(() => {
    if (isArrayEmpty(data?.data)) return []
    // 去除超级管理员
    return data?.data?.filter(u => u._id !== user?._id || u.roles[0] !== '*')
  }, [data, user?._id])

  const [{ visible, modalInfo }, setModal] = useState({
    visible: false,
    modalInfo: {
      uid: '',
      username: ''
    }
  })

  const columns = useMemo(() => [
    {
      dataIndex: 'nickname',
      key: 'nickname',
      title: '昵称',
    },
    {
      dataIndex: 'username',
      key: 'username',
      title: '账号名',
    },
    {
      dataIndex: 'enabled',
      key: 'enabled',
      title: '状态',
      render: (enabled: boolean) => enabled ? <Tag color='green'>已启用</Tag> : <Tag color='red'>已禁用</Tag>
    },
    {
      dataIndex: 'updated_at',
      key: 'updated_at',
      title: '更新时间',
      render: (unix: number) => dayjs.unix(unix).format('YYYY/MM/DD HH:mm:ss')
    },
    {
      key: 'action',
      title: '操作',
      render: (data: UserModel) => (
        <div>
          <Button type='link' className='!p-0' onClick={() => Router.push(`/admin-user/content?uid=${data._id}`)}>编辑信息</Button>
          <Divider type='vertical' />
          <Button type='link' className='!p-0' onClick={() => setModal({ visible: true, modalInfo: { uid: data._id, username: data.username } })}>重置密码</Button>
        </div>
      )
    }
  ], [])

  return (
    <PageLayout title='子用户管理'>
      <Button type='primary' className='mb-6' onClick={() => router.push('/admin-user/content')}>新增管理员</Button>
      <Table
        bordered
        pagination={false}
        dataSource={list}
        loading={loading}
        columns={columns}
      >
      </Table>
      <PasswordModal visible={visible} {...modalInfo} onClose={() => setModal(prev => ({ ...prev, visible: false }))} />
    </PageLayout>
  )
}

export default Page