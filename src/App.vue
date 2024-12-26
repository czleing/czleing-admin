<script setup>
import { theme } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import enUs from 'ant-design-vue/es/locale/en_US'
import { useSettingStore } from '@/stores/setting-store.js'
import { useCheckUpdate } from './hooks/useCheckUpdate'

const localeMap = {
  en: enUs,
  zh: zhCN
}
const settingStore = useSettingStore()
const locale = computed(() => localeMap[settingStore.locale] ?? zhCN)
const currTheme = computed(() => {
  return {
    ...settingStore.theme,
    algorithm: settingStore.isDark ? theme.darkAlgorithm : theme.defaultAlgorithm
  }
})
// 检测版本更新
useCheckUpdate()
</script>

<template>
  <a-config-provider
    :locale="locale"
    :theme="currTheme"
    :componentSize="settingStore.componentSize"
  >
    <RouterView />
  </a-config-provider>
</template>

<style>
</style>
