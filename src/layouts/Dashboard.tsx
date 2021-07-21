import { Footer } from '@/components/Footer'
import { Logo } from '@/components/Logo'
import { APP_NAME } from '@/configs/meta'
import { SIDE_MENUS } from '@/configs/route'
import { useUser } from '@/models/user'
import { isArrayEmpty } from '@/utils/utils'
import { Dropdown, Layout, Menu, MenuProps } from 'antd'
import { useRouter } from 'next/router'
import { FunctionComponent, useCallback } from 'react'
import { RiUserLine, RiLogoutCircleRLine } from 'react-icons/ri'

const { SubMenu } = Menu
const { Header, Sider, Content } = Layout

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
    <Header className='!bg-white flex-shrink-0 !px-6 flex items-center justify-end !h-12'>
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
          <Content className='bg-white p-6 m-6 mb-0 !flex-shrink-0'>
            {children}
          </Content>
          <Footer className='mt-0 h-16 flex-shrink-0' />
        </Layout>
      </Layout>
    </Layout>
  )
}