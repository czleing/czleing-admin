// vite.config.js
import { defineConfig, loadEnv } from "file:///Users/czleing/Documents/JMGroup/base/base-backend-static/node_modules/.pnpm/vite@4.5.3_@types+node@20.14.9_less@4.2.0_sass@1.77.6_terser@5.31.1/node_modules/vite/dist/node/index.js";
import vue from "file:///Users/czleing/Documents/JMGroup/base/base-backend-static/node_modules/.pnpm/@vitejs+plugin-vue@4.6.2_vite@4.5.3_@types+node@20.14.9_less@4.2.0_sass@1.77.6_terser@5.31.1__vue@3.4.31/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import Components from "file:///Users/czleing/Documents/JMGroup/base/base-backend-static/node_modules/.pnpm/unplugin-vue-components@0.25.2_@babel+parser@7.24.7_rollup@3.29.4_vue@3.4.31/node_modules/unplugin-vue-components/dist/vite.mjs";
import { AntDesignVueResolver } from "file:///Users/czleing/Documents/JMGroup/base/base-backend-static/node_modules/.pnpm/unplugin-vue-components@0.25.2_@babel+parser@7.24.7_rollup@3.29.4_vue@3.4.31/node_modules/unplugin-vue-components/dist/resolvers.mjs";
import { fileURLToPath, URL } from "node:url";
import { theme } from "file:///Users/czleing/Documents/JMGroup/base/base-backend-static/node_modules/.pnpm/ant-design-vue@4.2.6_vue@3.4.31/node_modules/ant-design-vue/lib/index.js";
import AutoImport from "file:///Users/czleing/Documents/JMGroup/base/base-backend-static/node_modules/.pnpm/unplugin-auto-import@0.19.0_@vueuse+core@10.11.0_vue@3.4.31__rollup@3.29.4/node_modules/unplugin-auto-import/dist/vite.js";
var __vite_injected_original_import_meta_url = "file:///Users/czleing/Documents/JMGroup/base/base-backend-static/vite.config.js";
var { defaultAlgorithm, defaultSeed } = theme;
var mapToken = defaultAlgorithm(defaultSeed);
var vite_config_default = defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      vue(),
      AutoImport({
        imports: ["vue", "vue-router", "vue-i18n"]
        // dirs: ['src/utils/index.js', 'src/enum'], // 将自定义的API也加入到自动导入
        // dts: 'src/utils/auto-import.d.ts', // 生成类型声明文件，项目使用了 TypeScript 才需要配置该项
        // eslintrc: { // 如果使用了 eslint，可以开启这个配置
        //   enabled: true,
        //   filepath: 'src/utils/.eslintrc-auto-import.json',
        //   globalsPropValue: true
        // }
      }),
      Components({
        resolvers: [
          // ant-design-vue 4.x 的自动按需引入
          AntDesignVueResolver({
            importStyle: false
            // css in js
          })
        ]
      })
    ],
    base: env.VITE_APP_CONTEXT_PATH,
    // 公共基础路径，会注入到全局变量 import.meta.env.BASE_URL，创建router时也需要指定根路径为此路径
    server: {
      host: "127.0.0.1",
      port: 3e3,
      strictPort: false,
      // 设为 true 时若端口已被占用则会直接退出，而不是尝试下一个可用端口。
      proxy: {
        "/api": {
          target: env.VITE_APP_DEV_PROXY,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, "")
        }
      }
    },
    build: {
      outDir: `dist/${mode}`
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
      }
    },
    css: {
      preprocessorOptions: {
        less: {
          // 在 vue、less 中使用主题色： color: @colorPrimary;
          modifyVars: mapToken
          // 将 ant-design-vue 中的样式变量作为全局 less 变量，参考：https://next.antdv.com/docs/vue/customize-theme-cn
        }
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvY3psZWluZy9Eb2N1bWVudHMvSk1Hcm91cC9iYXNlL2Jhc2UtYmFja2VuZC1zdGF0aWNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9jemxlaW5nL0RvY3VtZW50cy9KTUdyb3VwL2Jhc2UvYmFzZS1iYWNrZW5kLXN0YXRpYy92aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvY3psZWluZy9Eb2N1bWVudHMvSk1Hcm91cC9iYXNlL2Jhc2UtYmFja2VuZC1zdGF0aWMvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJ1xuaW1wb3J0IHsgQW50RGVzaWduVnVlUmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnXG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tICdub2RlOnVybCdcbmltcG9ydCB7IHRoZW1lIH0gZnJvbSAnYW50LWRlc2lnbi12dWUnXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xuXG5jb25zdCB7IGRlZmF1bHRBbGdvcml0aG0sIGRlZmF1bHRTZWVkIH0gPSB0aGVtZVxuY29uc3QgbWFwVG9rZW4gPSBkZWZhdWx0QWxnb3JpdGhtKGRlZmF1bHRTZWVkKVxuXG4vLyBcdTkxNERcdTdGNkVcdTk4NzlcdTUzQzJcdTgwMDNcdUZGMUFodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IGNvbW1hbmQsIG1vZGUgfSkgPT4ge1xuICAvLyBcdTUyQTBcdThGN0RcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0ZcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCAnJykgLy8gXHU3QjJDXHU0RTA5XHU0RTJBXHU1M0MyXHU2NTcwXHU0RTNBICcnIFx1ODg2OFx1NzkzQVx1NTJBMFx1OEY3RFx1NzNBRlx1NTg4M1x1NjU4N1x1NEVGNlx1NjI0MFx1NjcwOVx1NTNDMlx1NjU3MFxuICByZXR1cm4ge1xuICAgIHBsdWdpbnM6IFtcbiAgICAgIHZ1ZSgpLFxuICAgICAgQXV0b0ltcG9ydCh7XG4gICAgICAgIGltcG9ydHM6IFsndnVlJywgJ3Z1ZS1yb3V0ZXInLCAndnVlLWkxOG4nXSxcbiAgICAgICAgLy8gZGlyczogWydzcmMvdXRpbHMvaW5kZXguanMnLCAnc3JjL2VudW0nXSwgLy8gXHU1QzA2XHU4MUVBXHU1QjlBXHU0RTQ5XHU3Njg0QVBJXHU0RTVGXHU1MkEwXHU1MTY1XHU1MjMwXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1XG4gICAgICAgIC8vIGR0czogJ3NyYy91dGlscy9hdXRvLWltcG9ydC5kLnRzJywgLy8gXHU3NTFGXHU2MjEwXHU3QzdCXHU1NzhCXHU1OEYwXHU2NjBFXHU2NTg3XHU0RUY2XHVGRjBDXHU5ODc5XHU3NkVFXHU0RjdGXHU3NTI4XHU0RTg2IFR5cGVTY3JpcHQgXHU2MjREXHU5NzAwXHU4OTgxXHU5MTREXHU3RjZFXHU4QkU1XHU5ODc5XG4gICAgICAgIC8vIGVzbGludHJjOiB7IC8vIFx1NTk4Mlx1Njc5Q1x1NEY3Rlx1NzUyOFx1NEU4NiBlc2xpbnRcdUZGMENcdTUzRUZcdTRFRTVcdTVGMDBcdTU0MkZcdThGRDlcdTRFMkFcdTkxNERcdTdGNkVcbiAgICAgICAgLy8gICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAvLyAgIGZpbGVwYXRoOiAnc3JjL3V0aWxzLy5lc2xpbnRyYy1hdXRvLWltcG9ydC5qc29uJyxcbiAgICAgICAgLy8gICBnbG9iYWxzUHJvcFZhbHVlOiB0cnVlXG4gICAgICAgIC8vIH1cbiAgICAgIH0pLFxuICAgICAgQ29tcG9uZW50cyh7XG4gICAgICAgIHJlc29sdmVyczogW1xuICAgICAgICAgIC8vIGFudC1kZXNpZ24tdnVlIDQueCBcdTc2ODRcdTgxRUFcdTUyQThcdTYzMDlcdTk3MDBcdTVGMTVcdTUxNjVcbiAgICAgICAgICBBbnREZXNpZ25WdWVSZXNvbHZlcih7XG4gICAgICAgICAgICBpbXBvcnRTdHlsZTogZmFsc2UgLy8gY3NzIGluIGpzXG4gICAgICAgICAgfSlcbiAgICAgICAgXVxuICAgICAgfSlcbiAgICBdLFxuICAgIGJhc2U6IGVudi5WSVRFX0FQUF9DT05URVhUX1BBVEgsIC8vIFx1NTE2Q1x1NTE3MVx1NTdGQVx1Nzg0MFx1OERFRlx1NUY4NFx1RkYwQ1x1NEYxQVx1NkNFOFx1NTE2NVx1NTIzMFx1NTE2OFx1NUM0MFx1NTNEOFx1OTFDRiBpbXBvcnQubWV0YS5lbnYuQkFTRV9VUkxcdUZGMENcdTUyMUJcdTVFRkFyb3V0ZXJcdTY1RjZcdTRFNUZcdTk3MDBcdTg5ODFcdTYzMDdcdTVCOUFcdTY4MzlcdThERUZcdTVGODRcdTRFM0FcdTZCNjRcdThERUZcdTVGODRcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIGhvc3Q6ICcxMjcuMC4wLjEnLFxuICAgICAgcG9ydDogMzAwMCxcbiAgICAgIHN0cmljdFBvcnQ6IGZhbHNlLCAvLyBcdThCQkVcdTRFM0EgdHJ1ZSBcdTY1RjZcdTgyRTVcdTdBRUZcdTUzRTNcdTVERjJcdTg4QUJcdTUzNjBcdTc1MjhcdTUyMTlcdTRGMUFcdTc2RjRcdTYzQTVcdTkwMDBcdTUxRkFcdUZGMENcdTgwMENcdTRFMERcdTY2MkZcdTVDMURcdThCRDVcdTRFMEJcdTRFMDBcdTRFMkFcdTUzRUZcdTc1MjhcdTdBRUZcdTUzRTNcdTMwMDJcbiAgICAgIHByb3h5OiB7XG4gICAgICAgICcvYXBpJzoge1xuICAgICAgICAgIHRhcmdldDogZW52LlZJVEVfQVBQX0RFVl9QUk9YWSxcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaS8sICcnKSxcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgYnVpbGQ6IHtcbiAgICAgIG91dERpcjogYGRpc3QvJHttb2RlfWBcbiAgICB9LFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpXG4gICAgICB9XG4gICAgfSxcbiAgICBjc3M6IHtcbiAgICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcbiAgICAgICAgbGVzczoge1xuICAgICAgICAgIC8vIFx1NTcyOCB2dWVcdTMwMDFsZXNzIFx1NEUyRFx1NEY3Rlx1NzUyOFx1NEUzQlx1OTg5OFx1ODI3Mlx1RkYxQSBjb2xvcjogQGNvbG9yUHJpbWFyeTtcbiAgICAgICAgICBtb2RpZnlWYXJzOiBtYXBUb2tlbiAvLyBcdTVDMDYgYW50LWRlc2lnbi12dWUgXHU0RTJEXHU3Njg0XHU2ODM3XHU1RjBGXHU1M0Q4XHU5MUNGXHU0RjVDXHU0RTNBXHU1MTY4XHU1QzQwIGxlc3MgXHU1M0Q4XHU5MUNGXHVGRjBDXHU1M0MyXHU4MDAzXHVGRjFBaHR0cHM6Ly9uZXh0LmFudGR2LmNvbS9kb2NzL3Z1ZS9jdXN0b21pemUtdGhlbWUtY25cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNlYsU0FBUyxjQUFjLGVBQWU7QUFDblksT0FBTyxTQUFTO0FBQ2hCLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVMsNEJBQTRCO0FBQ3JDLFNBQVMsZUFBZSxXQUFXO0FBQ25DLFNBQVMsYUFBYTtBQUN0QixPQUFPLGdCQUFnQjtBQU5tTSxJQUFNLDJDQUEyQztBQVEzUSxJQUFNLEVBQUUsa0JBQWtCLFlBQVksSUFBSTtBQUMxQyxJQUFNLFdBQVcsaUJBQWlCLFdBQVc7QUFHN0MsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxTQUFTLEtBQUssTUFBTTtBQUVqRCxRQUFNLE1BQU0sUUFBUSxNQUFNLFFBQVEsSUFBSSxHQUFHLEVBQUU7QUFDM0MsU0FBTztBQUFBLElBQ0wsU0FBUztBQUFBLE1BQ1AsSUFBSTtBQUFBLE1BQ0osV0FBVztBQUFBLFFBQ1QsU0FBUyxDQUFDLE9BQU8sY0FBYyxVQUFVO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQVEzQyxDQUFDO0FBQUEsTUFDRCxXQUFXO0FBQUEsUUFDVCxXQUFXO0FBQUE7QUFBQSxVQUVULHFCQUFxQjtBQUFBLFlBQ25CLGFBQWE7QUFBQTtBQUFBLFVBQ2YsQ0FBQztBQUFBLFFBQ0g7QUFBQSxNQUNGLENBQUM7QUFBQSxJQUNIO0FBQUEsSUFDQSxNQUFNLElBQUk7QUFBQTtBQUFBLElBQ1YsUUFBUTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sWUFBWTtBQUFBO0FBQUEsTUFDWixPQUFPO0FBQUEsUUFDTCxRQUFRO0FBQUEsVUFDTixRQUFRLElBQUk7QUFBQSxVQUNaLGNBQWM7QUFBQSxVQUNkLFNBQVMsQ0FBQyxTQUFTLEtBQUssUUFBUSxVQUFVLEVBQUU7QUFBQSxRQUM5QztBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxRQUFRLFFBQVEsSUFBSTtBQUFBLElBQ3RCO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTCxLQUFLLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLE1BQ3REO0FBQUEsSUFDRjtBQUFBLElBQ0EsS0FBSztBQUFBLE1BQ0gscUJBQXFCO0FBQUEsUUFDbkIsTUFBTTtBQUFBO0FBQUEsVUFFSixZQUFZO0FBQUE7QUFBQSxRQUNkO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
