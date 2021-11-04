import { defineConfig } from 'umi';
import { resolve } from 'path'
import routes from './routes'

export default defineConfig({
  favicon: '/favicon.ico',
  title: '共价云金融分期管理后台',
  metas: [
    { 'http-equiv': 'Cache-Control', 'content': 'no-cache, no-store, must-revalidate' },
    { 'http-equiv': 'Pragma', 'content': 'no-cache', },
    { 'http-equiv': 'Expires', 'content': '0' },
  ],
  scripts: [
    { src: '/g6.min.js' },
    "G6.track(false)",
    "const doWarn = window.console.warn; window.console.warn = (...args) => {if (typeof args[0] !== 'string' || args[0].indexOf('componentWill') === -1) doWarn(...args)}"],
  routes,
  nodeModulesTransform: {
    type: 'none',
  },
  dynamicImport: {},
  outputPath: `./dist/${process.env.APP_KEY}`,
  webpack5: {},
  // mfsu: {},
  fastRefresh: {},
  dva: { hmr: true },
  alias: {
    components: resolve(__dirname, './src/components'),
    utils: resolve(__dirname, './src/utils'),
  },
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'lodash',
        libraryDirectory: '',
        camel2DashComponentName: false,
      },
      'lodash',
    ],
  ],
  devtool: false,
  define: {
    "process.env.APP_KEY": 'develop',
    "process.env.API": ['develop', 'pre', 'master'].indexOf(process.env.APP_KEY),
  },
  chainWebpack(config) {
    config.module
      .rule('lint')
      .test(/\.js(x)?$/)
      .pre()
      .include.add(resolve(__dirname, './src/pages'))
      .end()
      .use('eslint')
      .loader('eslint-loader')
  },
});
