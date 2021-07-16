# 腾讯云开发管理站点｜模版

基于 [腾讯云开发](https://cloud.tencent.com/document/product/876/34654) 的管理端模板，支持以下特性：

1. 基于 `react` 并引入 `nextjs` 作为基础开发框架
2. 支持使用 typescript 进行开发
3. 支持使用 `antd` 并配合 `tailwindcss` 快速开发设计，无需显式编写 css 代码
4. 支持一些通用的能力，如 用户登录登出、富文本文件编辑
5. 支持一件部署至腾讯云开发环境
6. 等等

## 准备工作

> 首次开发前务必过一遍/检查一遍以下流程，同时 **强烈建议** 配合 [blitz-func](https://github.com/jay4q/blitz-func) 一起使用

### 本地开发环境

+ 确保：安装 `nodejs>=14.x` 并安装 `npm i -g yarn` 作为包管理工具
+ 建议：使用 `vscode` 作为编程工具
+ 确保：在项目根目录复制 `.env.example` 为 `.env.development.local` 文件，编写环境变量。也可以参考 `.env.production.local` 文件编写

### 腾讯云开发环境

+ 确保：「登录授权」->「匿名登录」为开启状态。使 WEB 应用能够登录腾讯云开发
+ 确保：「安全配置」->「WEB安全域名」已将你的域名加入。让本地、产线环境能够访问腾讯云开发资源
+ 确保：「云存储」->「权限设置」->「自定义安全规则」配置好 `"read": "auth != null";"write": "auth != null`。仅限登录用户访问和操作云存储

### 开始开发

1. 执行 `yarn` 安装依赖
2. 执行 `yarn dev` 命令开始开发

## 部署

1. 执行 `yarn deploy` 部署至腾讯云开发静态托管

## 注意事项和约定

+ 即便 `nextjs` 支持服务端渲染，但由于管理端没必要搜索引擎优化，因此单纯以 **客户端渲染** 的方法编写页面和组件即可
+ `node-vibrant` 目前锁定在 3.1.6 版本，待 [官方](https://github.com/Vibrant-Colors/node-vibrant) 升级完成后再升级
+ 不要用 `antd` 自带的图标，请使用 [react-icons](https://react-icons.github.io/react-icons)
+ 暂时先不要升级 `next` ，待 `next-plugin-antd-less` 兼容后再更新

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
+ [ ] 编辑器多媒体上传组件二次选择失效的问题（应该是因为重复选择相同文件导致的）
+ [ ] 「待定」封装云函数和HTTP请求

### UI设计

+ [ ] 左上角显示 `欢迎 ${nickname}` 并支持退出登录。数据和逻辑已完成，请参考 `./src/models/user`

### 框架设计

+ [ ] 「待定」支持图集上传能力
+ [ ] 使用 JSON 动态生成表单，依赖 [X-Render](https://x-render.gitee.io/)

## 参考

+ [如何配置next-less-antd](https://github.com/SolidZORO/mkn)
+ [腾讯云开发工具](https://docs.cloudbase.net/api-reference/webv2/initialization.html)
