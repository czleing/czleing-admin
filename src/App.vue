<script setup>
import { computed } from 'vue'
import { theme } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import enUs from 'ant-design-vue/es/locale/en_US'
import { useSettingStore } from '@/stores/setting-store.js'

const settingStore = useSettingStore()
const locale = computed(() => settingStore.locale === 'en' ? enUs : zhCN)
const currTheme = computed(() => {
  return {
    ...settingStore.theme,
    algorithm: settingStore.isDark ? theme.darkAlgorithm : theme.defaultAlgorithm
  }
})
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
