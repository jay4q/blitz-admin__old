const path = require('path')
const withPlugins = require('next-compose-plugins')
const withAntdLess = require('next-plugin-antd-less')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const { config } = require('dotenv')

const env = config({
  path: path.resolve(process.cwd(), '.env.production.local')
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
  basePath: '/' + env.NEXT_PUBLIC_TCB_SUBPATH || '',
  future: {
    webpack5: true,
  },
})