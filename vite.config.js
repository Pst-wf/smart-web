import {resolve} from 'path';
import vue from '@vitejs/plugin-vue';
import customVariables from '/@/theme/custom-variables.js';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'


const pathResolve = (dir) => {
  return resolve(__dirname, '.', dir);
};
export default {
  base: process.env.NODE_ENV === 'production' ? '/' : '/',
  root: process.cwd(),
  resolve: {
    alias: [
      // 国际化替换
      {
        find: 'vue-i18n',
        replacement: 'vue-i18n/dist/vue-i18n.cjs.js',
      },
      // 绝对路径重命名：/@/xxxx => src/xxxx
      {
        find: /\/@\//,
        replacement: pathResolve('src') + '/',
      },
      {
        find: /^~/,
        replacement: '',
      },
    ],
  },
  // 服务端渲染
  server: {
    host: '0.0.0.0',
    port: 8081,
    // open: true,
    proxy: {
      //凡是以 /api 地址开头的请求, 都要做代理操作
      '/api': {
        //目的地址 => 代理服务器,需要向该地址发起请求
        target: 'http://localhost:8888',
        // target: 'http://smart.pstech360.com/api',
        //是否跨域
        changeOrigin: true,
        //是否重写  将路径中的 /api 重写为''  ,重写的是自己的路径地址
        //向存储数据的服务器发送请求的地址是  target中的地址 + 自己写的路径
        //如果不重写, 则请求地址中会有两个 /api 字符, 这样请求的地址就错了
        rewrite: path => path.replace(/^\/api/, '')
      }
    },
    fs: {
      cachedChecks: false
    }
  },
  plugins: [vue(),viteCommonjs()],
  optimizeDeps: {
    include: ['ant-design-vue/es/locale/zh_CN', 'dayjs/locale/zh-cn', 'ant-design-vue/es/locale/en_US'],
    exclude: ['vue-demi'],
  },
  build: {
    // 清除console和debugger
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        //配置这个是让不同类型文件放在不同文件夹，不会显得太乱
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: '[ext]/[name]-[hash].[ext]',
        manualChunks(id) {
          //静态资源分拆打包
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
      },
    },
    target: 'modules',
    outDir: 'dist', // 指定输出路径
    assetsDir: 'assets', // 指定生成静态文件目录
    assetsInlineLimit: '4096', // 小于此阈值的导入或引用资源将内联为 base64 编码
    chunkSizeWarningLimit: 500, // chunk 大小警告的限制
    minify: 'terser', // 混淆器，terser构建后文件体积更小
    emptyOutDir: true, //打包前先清空原有打包文件
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: customVariables,
        javascriptEnabled: true,
      },
    },
  },
  define: {
    __INTLIFY_PROD_DEVTOOLS__: false,
    'process.env': process.env,
  },
};
