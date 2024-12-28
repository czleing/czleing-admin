<template>
  <div class="header-setting">
    <a-tooltip placement="top" title="主题设置">
      <SkinOutlined style="font-size: 18px;" @click="openSetting" />
    </a-tooltip>
  </div>
  <Modal ref="settingModal" title="设置" width="450" mode="drawer" :footer="null">
    <!-- <a-divider>主题</a-divider> -->
    <h4 class="pb10 text-gray2">主题</h4>
    <a-space class="flex-x">
      <span>选择主题：</span>
      <a-select v-model:value="settingStore.themeName" style="width: 150px;" @change="handleChange">
        <a-select-option
          v-for="(item, index) in settingStore.themes"
          :key="item.name"
          :value="item.name"
        >
          {{ item.name }}
        </a-select-option>
      </a-select>
      <a-tooltip
        placement="top"
        v-for="(kv, index) in currColors"
        :key="index"
      >
        <template #title>
          <span>{{ kv[0] }}: {{ kv[1] }}</span>
        </template>
        <span class="color-box" :class="{'ml20': index === 0}" :style="{ backgroundColor: kv[1] }" />
      </a-tooltip>
    </a-space>
    <a-space class="flex-x mt20">
      <span>组件大小：</span>
      <a-select v-model:value="settingStore.componentSize" style="width: 150px;">
        <a-select-option value="small">小</a-select-option>
        <a-select-option value="middle">中</a-select-option>
        <a-select-option value="large">大</a-select-option>
      </a-select>
    </a-space>
    <a-space class="flex-x mt20">
      <span>暗色模式：</span>
      <a-switch v-model:checked="isDark" checked-children="Dark" un-checked-children="Light" @change="changeMode"></a-switch>
    </a-space>
    <a-space class="flex-x mt20">
      <span>圆润布局：</span>
      <a-switch v-model:checked="settingStore.useRadius" />
    </a-space>
    <!-- <a-divider>语言</a-divider> -->
    <h4 class="mt20 text-gray2">语言</h4>
    <a-space class="flex-x mt20">
      <span>选择语言：</span>
      <a-select v-model:value="settingStore.locale" style="width: 150px;" @change="handleLocalChange">
        <a-select-option value="zh">
          <div class="flex-x x-middle">
            <img src="@/assets/images/locale/zh.png" class="radius3" style="height: 16px;" >
            <span class="ml8">中文</span>
          </div>
        </a-select-option>
        <a-select-option value="en">
          <div class="flex-x x-middle">
            <img src="@/assets/images/locale/en.png" class="radius3" style="height: 16px;" >
            <span class="ml8">English</span>
          </div>
        </a-select-option>
      </a-select>
    </a-space>
    <!-- <a-divider>其他</a-divider> -->
    <h4 class="mt20 text-gray2">其他</h4>
    <a-space class="flex-x mt20">
      <span>展示天气：</span>
      <a-switch v-model:checked="settingStore.useWeather" />
    </a-space>
  </Modal>
</template>

<script setup>
import { useSettingStore } from '@/stores/setting-store.js'
import { SkinOutlined } from '@ant-design/icons-vue'

const settingStore = useSettingStore()
const settingModal = ref()
const isDark = ref(settingStore.isDark)
const currColors = computed(() => Object.entries(settingStore.theme?.token))

function changeMode (val) {
  setTimeout(settingStore.toggleMode, 200)
}
const openSetting = () => {
  settingModal.value.open()
}
const closeSetting = () => {
  settingModal.value.close()
}

const handleChange = name => {
  settingStore.setThemeByName(name)
}
const handleLocalChange = locale => {
  settingStore.locale = locale
}
</script>

<style lang="less" scoped>
.color-box {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 3px;
}
</style>
