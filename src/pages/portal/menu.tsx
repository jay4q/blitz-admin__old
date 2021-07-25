import { FunctionComponent, useState } from 'react'
import { PageLayout } from '@/layouts/PageLayout'
import { Card, Tree } from 'antd'

const mockTree = [
  {
    key: '1',
    title: '所有菜单',
    children: [
      {
        key: '1-1',
        title: '简介',
        children: [
          {
            key: '1-1-1',
            title: '关于我们',
          },
          {
            key: '1-1-2',
            title: '机构设置',
          }
        ]
      },
      {
        key: '1-2',
        title: '活动',
        children: [
          {
            key: '1-2-1',
            title: '亲子活动',
          },
          {
            key: '1-2-2',
            title: '志愿者活动',
          }
        ]
      }
    ]
  }
]

// todo:
// 技术：需要引入 zustand 做状态管理
// 左侧树形菜单方便查询即可。默认选中第一个（如果有的话）；默认第一级是所有菜单
// 右侧展示当前菜单下的所有子菜单，列表形式呈现；支持拖拽排序；支持删除和添加子菜单
// 当前菜单和子菜单都支持在当前页点击编辑，侧边弹窗形式
// 编辑时候，默认是在左侧选中的菜单下进行添加，同时也可以考虑使用 TreeSelect 空间

/**
 * 门户网站-菜单管理
 */
const Index: FunctionComponent = () => {
  const [menus, setMenus] = useState(mockTree)

  const [selectedMenus, setSelectedMenus] = useState<string[]>([])

  const onMenuSelect = (keys: string[]) => {
    // todo: 当选中的时候，需要改变右侧的

    // 只支持选中一个
    setSelectedMenus([keys[0]])
  }

  return (
    <PageLayout title='菜单管理' theme='default' className='flex flex-row justify-self-stretch'>
      <Card bordered={false} className='w-64 !mr-6 overflow-auto' style={{ maxHeight: 'calc(100vh - 48px - 84px - 64px)' }}>
        <Tree
          blockNode
          defaultExpandAll
          showIcon={false}
          treeData={menus}
          showLine={{ showLeafIcon: false }}
          selectedKeys={selectedMenus}
          // @ts-ignore
          onSelect={onMenuSelect}
        />
      </Card>
      <div className='flex-grow bg-white'>
      </div>
    </PageLayout>
  )
}

export default Index