import { defineConfig } from 'vite'
import viteVue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import { fileURLToPath, URL } from 'node:url'
import { theme } from 'ant-design-vue'

const { defaultAlgorithm, defaultSeed } = theme
const mapToken = defaultAlgorithm(defaultSeed)

// 配置项参考：https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    viteVue(),
    // ant-design-vue 4.x 的自动按需引入
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false // css in js
        })
      ]
    })
  ],
  base: process.env.VITE_APP_CONTEXT_PATH, // 公共基础路径，会注入到全局变量 import.meta.env.BASE_URL，创建router时也需要指定根路径为此路径
  server: {
    host: '127.0.0.1',
    port: 8080,
    strictPort: false // 设为 true 时若端口已被占用则会直接退出，而不是尝试下一个可用端口。
    // proxy: {
    //   '/api': {
    //     target: process.env.VITE_APP_DEV_PROXY,
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ''),
    //   }
    // }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        // 在 vue、less 中使用主题色： color: @colorPrimary;
        modifyVars: mapToken // 将 ant-design-vue 中的样式变量作为全局 less 变量，参考：https://next.antdv.com/docs/vue/customize-theme-cn
      }
    }
  }
})
