# 腾讯云开发管理站点｜模版

基于 [腾讯云开发](https://cloud.tencent.com/document/product/876/34654) 的管理端模板，支持以下特性：

1. 基于 `react` 并引入 `nextjs` 作为基础开发框架
2. 支持使用 typescript 进行开发
3. 支持使用 `antd` 并配合 `tailwindcss` 快速开发设计，无需显式编写 css 代码
4. 支持一些通用的能力，如 用户登录登出、富文本文件编辑
5. 支持一件部署至腾讯云开发环境
6. 配合 [blitz-func](https://github.com/jay4q/blitz-func) 开箱即用
7. 等等

## 准备工作

> 首次开发前务必过一遍/检查一遍以下流程，同时 **强烈建议** 配合 [blitz-func](https://github.com/jay4q/blitz-func) 一起使用

### 本地开发环境

+ 确保：安装 `nodejs>=14.x` 并安装 `npm i -g yarn` 作为包管理工具
+ 建议：使用 `vscode` 作为编程工具
+ 确保：在项目根目录复制 `.env.example` 为 `.env.development.local` 文件，编写环境变量。也可以参考 `.env.production.local` 文件编写

### 腾讯云开发环境

+ 确保：「登录授权」->「匿名登录」为开启状态。使 WEB 应用能够登录腾讯云开发
+ 确保：「安全配置」->「WEB安全域名」已将你的域名加入。让本地、产线环境能够访问腾讯云开发资源
+ 确保：「云存储」->「权限设置」->「自定义安全规则」配置好 `"read": "auth != null","write": "auth != null"`。仅限登录用户访问和操作云存储

### 开始开发

1. 执行 `yarn` 安装依赖
2. 执行 `yarn dev` 命令开始开发

## 部署

1. 执行 `yarn deploy` 部署至腾讯云开发静态托管

## 注意事项和约定

+ 中后台管理端，是用户态优先并且没有SEO的必要，仅考虑前端渲染和静态文件部署，因此
  + 切忌：使用 nextjs 中服务端渲染的部分，例如 `getInitalProps` 等
  + 确保：仅在客户端引入 富文本编辑器、上传、图片展示组件
+ 切忌：使用 `antd` 自带的图标，请使用 [react-icons](https://react-icons.github.io/react-icons)
+ 建议：使用 `./src/utils/tcbRequest.ts` 发起请求，这样可以自由在 http 和 sdk 中切换请求云函数
  + 例如开发环境，连接本地用 web-server 模拟的云函数，这时就需要使用 http 请求
  + 例如产线环境，官方建议直接使用 sdk 请求云函数（http 触发云函数有限制）
+ 修改环境变量后，需要重新启动

### 客户端组件

部分组件例如 富文本编辑器、图片展示组件，因为在引入或者初始化过程中依赖到了浏览器的能力，因此 **不能在服务端引入**

下面以富文本组件为例，展示如何正确引入客户端组件

``` tsx
import dynamic from 'next/dynamic'

const Editor = dynamic(
  // @ts-ignore
  () => import('@/components/form/Editor').then(mod => mod.Editor),
  { ssr: false }
)

// ...
```

### 样式

+ 配合 [antd](https://ant.design/components/overview-cn/) 和 [tailwindcss]('https://tailwindcss.com/') 开发界面
+ 根据设计师配色和布局要求，通过修改 `./src/styles/antd.less` 覆盖默认样式。可以参考 [默认样式](https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less) 进行细粒度控制
  + 也可以参考 [色彩中心](https://ant.design/docs/spec/colors-cn) 选择合适的颜色

同时，为了实现 **集中化** 的样式配置，在覆盖了 `./src/styles/antd.less` 配置后，请确保接下来两个文件也做相应的配置：

``` less
// ./src/styles/antd-css.less

:root {
  // ...
  --ovrride-color: @ovrride-color;
}
```

``` js
// ./tailwind.config.js

module.exports = {
  // ...
  theme: {
    extend: {
      colors: {
        "ovrride": "var(--ovrride-color)"
      }
    },
  },
  // ...
}
```

## Todo

+ [x] 通过 http 接入云函数，以及用户登录
+ [x] 升级至 `nextjs@11`
+ [x] 编辑器多媒体上传组件二次选择失效的问题（应该是因为重复选择相同文件导致的）
+ [ ] 基础的门户网站结构设计
  + [ ] 菜单：拖拽排序、基础字段编辑
  + [ ] 文章：图片、音视频、文件上传、基础字段编辑

### 组件设计

+ [ ] 菜单页使用拖拽组件
  + [ ] 尝试并验证使用 antd-tree 实现
  + [ ] 如何高效地记录排序，让每次排序在后端更新个数最少
+ [ ] 图片、视频、音频、文件上传（同时支持多个上传）
+ [ ] 图片组件可以尝试直接封装一下 antd 图片上传组件即可
+ [ ] `node-vibrant` 目前锁定在 3.1.6 版本，待 [官方](https://github.com/Vibrant-Colors/node-vibrant) 升级完成后再升级
+ [ ] 「待定」富文本编辑器使用 [mammoth](https://github.com/mwilliamson/mammoth.js) 将word转换为html

### 设计

+ [x] 管理页仅限右侧滑动
+ [x] 加入 404 页

## 参考

+ [如何配置next-less-antd](https://github.com/SolidZORO/mkn)
+ [腾讯云开发工具](https://docs.cloudbase.net/api-reference/webv2/initialization.html)
+ [将word文档转换为html](https://github.com/mwilliamson/mammoth.js)
+ [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd)
