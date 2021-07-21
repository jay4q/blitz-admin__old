import { Footer } from '@/components/Footer'
import { APP_NAME } from '@/configs/meta'
import { SIDE_MENUS } from '@/configs/route'
import { isArrayEmpty } from '@/utils/utils'
import { Layout, Menu } from 'antd'
import { useRouter } from 'next/router'
import { FunctionComponent } from 'react'

const { SubMenu } = Menu
const { Header, Sider, Content } = Layout

const UserMenu: FunctionComponent = () => {
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
                  <Menu.Item key={submenu.path}>
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

/**
 * 管理页统一布局
 */
export const Dashboard: FunctionComponent = ({ children }) => {
  return (
    <Layout className='w-full h-screen'>
      <Layout>
        <Sider theme='dark'>
          <div className='h-8 m-4 flex flex-row items-center'>
            {
              // todo: logo 待定
            }
            <h1 className='text-white text-lg font-bold m-0'>🎨&emsp;{APP_NAME}</h1>
          </div>
          <UserMenu />
        </Sider>
        <Layout className='min-h-screen overflow-auto'>
          <Header className='!bg-white flex-shrink-0'></Header>
          <Content className='bg-white p-6 m-6 mb-0 !flex-shrink-0'>
            {children}
          </Content>
          <Footer className='mt-0 h-16 flex-shrink-0' />
        </Layout>
      </Layout>
    </Layout>
  )
}