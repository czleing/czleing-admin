<!-- 首页 -->
<template>
  <div class="home-page">
    <div class="ml20 mt20">首页</div>
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="Tab 1">Content of Tab Pane 1</a-tab-pane>
      <a-tab-pane key="2" tab="Tab 2" force-render>Content of Tab Pane 2</a-tab-pane>
      <a-tab-pane key="3" tab="Tab 3">Content of Tab Pane 3</a-tab-pane>
    </a-tabs>
    <a-space>
      <a-button type="primary">按钮</a-button>
      <a-input />
      <a-switch v-model:checked="isDark" @change="changeMode"></a-switch>
      <a-select v-model:value="settingStore.componentSize">
        <a-select-option value="small">small</a-select-option>
        <a-select-option value="middle">middle</a-select-option>
        <a-select-option value="large">large</a-select-option>
      </a-select>
      <a-select v-model:value="themeName" style="width:100px;" @change="changeTheme">
        <a-select-option
          v-for="item in settingStore.themes"
          :key="item.name"
          :value="item.name"
        >
          {{ item.name }}
        </a-select-option>
      </a-select>
      <a-date-picker v-model:value="date1" />
    </a-space>
    <div class="mt20" />
    <a-space direction="vertical">
      <!-- v-draggable="{ dragClass: 'title', moveClass: 'content' }" -->
      <div v-draggable class="green radius5 overflow-hidden" style="width:180px;">
        <div class="title px20 py10" :style="{ backgroundColor: token.colorPrimary }">标题栏</div>
        <div class="content bg-primary-50 pa20">
          这是需要移动的内容
          <br />
          这是需要移动的内容
          <br />
          这是需要移动的内容
          <br />
        </div>
      </div>
      <file-upload accept=".zip" :fileSize="2048" :maxCount="1" />
      <image-upload :fileSize="2048" :maxCount="2" />
    </a-space>
  </div>
</template>

<script setup>
import { useSettingStore } from '@/stores/setting-store.js'
import { ref } from 'vue'
import { theme } from 'ant-design-vue'

defineOptions({
  name: 'HomePage'
})
const { useToken } = theme
const { token } = useToken()

const settingStore = useSettingStore()
const activeKey = ref('1')
const isDark = ref(settingStore.isDark)
const themeName = ref(settingStore.themeName)
const date1 = ref()

function changeMode (val) {
  settingStore.toggleMode()
}
function changeTheme (val) {
  settingStore.setThemeByName(val)
}
</script>

<style lang="less" scoped>
.home-page {
  .title {
  }
}
</style>
