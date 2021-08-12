import { PostAdminUserReq } from '@/apis/admin-user/types'
import { ContentLayout } from '@/layouts/ContentLayout'
import { Checkbox, Form, Input, message, Switch } from 'antd'
import FormItem from 'antd/lib/form/FormItem'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { FunctionComponent } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Confirm } from '@/components/form/Confirm'
import { useRequest } from 'ahooks'
import { patchOne, postOne } from '@/apis/admin-user/mutation'
import { getOne, getRoles } from '@/apis/admin-user/query'
import { useEffect } from 'react'
import { trimObject } from '@/utils/utils'

/**
 * @description 新增/编辑管理员
 */
const Page: FunctionComponent = () => {
  const router = useRouter()
  const uid = router.query.uid as string || ''
  const documentTitle = !!uid ? '修改管理员' : '新增管理员'

  const { reset, control, handleSubmit, formState: { errors } } = useForm<PostAdminUserReq>()

  const { loading: isIniting, data: initialData } = useRequest(async () => {
    if (!!uid) {
      return await getOne(uid)
    } else {
      return await getRoles()
    }
  }, { refreshDeps: [uid] })

  const defaultUser = !!uid ? initialData?.data?.user : undefined
  const defaultRoleOptions = useMemo(() => (
    (initialData?.data?.roles || []).map(role => ({
      label: role.name,
      value: role.code,
    }))
  ), [initialData])

  const { loading: isSubmitting, run: submit } = useRequest(async (req: PostAdminUserReq) => {
    if (!!uid) {
      return await patchOne(req, uid)
    } else {
      return await postOne(req)
    }
  }, { manual: true })

  const onSubmit = async (req: PostAdminUserReq) => {
    const resp = await submit({ ...req, enabled: !!req.enabled })
    if (resp.code === 200) {
      message.success(`信息${!!uid ? '修改' : '新增'}成功 🎉🎉🎉 `)
      router.back()
    }
  }

  useEffect(() => {
    // 初始化表单信息
    if (defaultUser) {
      reset(trimObject(defaultUser, ['_id', 'password']))
    } else {
      reset({
        // 新增时，默认应该启用
        enabled: true,
      })
    }
  }, [defaultUser])

  return (
    <ContentLayout title={documentTitle} loading={isIniting}>
      <Form layout='vertical' className='w-full flex-grow'>
        <FormItem label='是否启用'>
          <Controller
            control={control}
            name='enabled'
            render={({ field: { value, ...restFields } }) => <Switch {...restFields} checked={value} />}
          />
        </FormItem>
        <FormItem label='管理员昵称' required validateStatus={errors.nickname && 'error'} help={errors.nickname && '请填写正确的昵称，仅限中文、英文和数字'}>
          <Controller
            control={control}
            name='nickname'
            rules={{ required: true, pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]{2,16}$/ }}
            render={({ field }) => <Input {...field} />}
          />
        </FormItem>
        <FormItem label='账号名' required validateStatus={errors.username && 'error'} help={errors.username && '请填写正确的账号名，仅限英文和数字'}>
          <Controller
            control={control}
            name='username'
            rules={{ required: true, pattern: /^[a-zA-Z0-9]{4,16}$/ }}
            render={({ field }) => <Input {...field} />}
          />
        </FormItem>
        {
          // 修改用户时，不需要修改密码
          !uid && (
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
          )
        }
        <FormItem label='可用角色' required validateStatus={errors.roles && 'error'} help={errors.roles && '请至少选择一个角色'}>
          <Controller
            name='roles'
            control={control}
            rules={{ required: true, validate: v => v.length > 0 }}
            render={({ field }) => <Checkbox.Group {...field} options={defaultRoleOptions} />}
          />
        </FormItem>
        <Confirm
          isPatch={!!uid}
          loading={isSubmitting}
          onConfirm={handleSubmit(onSubmit)}
        />
      </Form>
    </ContentLayout>
  )
}

export default Page