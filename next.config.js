const withPlugins = require('next-compose-plugins')
const withAntdLess = require('next-plugin-antd-less')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const path = require('path')
const { config } = require('dotenv')

const env = config({
  path: path.resolve(process.cwd(), process.env.NODE_ENV === 'development' ? '.env.development.local' : '.env.production.local')
}).parsed || {}

const plugins =
  [
    [
      withAntdLess,
      {
        // // optional
        // modifyVars: { '@primary-color': '#000000' },
        // // optional
        // lessVarsFilePath: './src/styles/variables.less',
        // // optional
        // lessVarsFilePathAppendToEndOfContent: false,
        // // optional https://github.com/webpack-contrib/css-loader#object
        // cssLoaderOptions: {},
      },
    ],
    [
      withBundleAnalyzer
    ]
  ]

module.exports = withPlugins(plugins, {
  basePath: env.NEXT_PUBLIC_TCB_WEB_SUBPATH || '',
})