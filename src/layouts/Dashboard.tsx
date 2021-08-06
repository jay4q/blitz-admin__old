import { Footer } from '@/components/Footer'
import { Logo } from '@/components/Logo'
import { APP_NAME } from '@/configs/meta'
import { SIDE_MENUS } from '@/configs/route'
import { useUser } from '@/models/user'
import { isArrayEmpty } from '@/utils/utils'
import { Dropdown, Layout, Menu, MenuProps, Spin } from 'antd'
import { useRouter } from 'next/router'
import { FunctionComponent, useCallback } from 'react'
import { RiUserLine, RiLogoutCircleRLine } from 'react-icons/ri'

const { SubMenu } = Menu
const { Header, Sider } = Layout

const LayoutMenu: FunctionComponent = () => {
  const { pathname, push } = useRouter()

  return (
    <Menu theme='dark' mode='inline' selectedKeys={[pathname]} onClick={({ key }) => push(key)}>
      {
        SIDE_MENUS?.map(menu => {
          if (isArrayEmpty(menu.children)) {
            return (
              <Menu.Item key={menu.path} icon={menu.icon ? <menu.icon /> : null}>
                {menu.name}
              </Menu.Item>
            )
          }

          return (
            <SubMenu key={menu.path} title={menu.name} icon={menu.icon ? <menu.icon /> : null}>
              {
                menu.children?.map(submenu => (
                  <Menu.Item key={submenu.path} icon={submenu.icon ? <submenu.icon /> : null}>
                    {submenu.name}
                  </Menu.Item>
                ))
              }
            </SubMenu>
          )
        })
      }
    </Menu>
  )
}

const LayoutHeader: FunctionComponent = () => {
  const { handleLogout } = useUser()

  const onMenuClick: MenuProps['onClick'] = useCallback(
    event => {
      const { key } = event
      if (key === 'logout') {
        handleLogout(false)
        return
      }
    },
    [],
  )

  const dropDown = (
    <Menu selectedKeys={[]} className='min-w-[160px]' onClick={onMenuClick}>
      <Menu.Item key='logout'>
        <span className='w-full h-full flex items-center'>
          <RiLogoutCircleRLine className='text-gray-500 m-0' />
          <span className='ml-2 text-gray-500'>退出登录</span>
        </span>
      </Menu.Item>
    </Menu>
  )

  return (
    <Header className='!bg-white flex-shrink-0 !px-6 flex items-center justify-end !h-12 z-0' style={{ boxShadow: '0 1px 4px rgb(0 21 41 / 8%)' }}>
      <Dropdown overlay={dropDown}>
        <span className='flex items-center h-12 px-3 cursor-pointer transition-colors duration-300 hover:bg-gray-50'>
          <RiUserLine className='text-base text-gray-500' />
        </span>
      </Dropdown>
    </Header>
  )
}

/**
 * 管理页统一布局
 */
export const Dashboard: FunctionComponent = ({ children }) => {
  const { user } = useUser()

  return (
    <Layout className='w-full h-screen'>
      <Layout>
        <Sider theme='dark'>
          <div className='h-8 m-4 flex flex-row items-center'>
            <Logo />
            <h1 className='text-white text-lg font-bold m-0 ml-2'>{APP_NAME}</h1>
          </div>
          <LayoutMenu />
        </Sider>
        <Layout className='min-h-screen overflow-auto'>
          <LayoutHeader />
          <div className='flex flex-col flex-auto flex-shrink-0 min-h-0'>
            <Spin size='large' />
          </div>
          {
            !!user ?
              <div className='flex flex-col flex-auto flex-shrink-0 min-h-0'>
                {children}
              </div>
              :
              <div className='flex flex-col flex-auto flex-shrink-0 min-h-0 pt-16'>
                <Spin size='large' />
              </div>
          }
          <Footer className='mt-0 h-16 flex-shrink-0' />
        </Layout>
      </Layout>
    </Layout>
  )
}