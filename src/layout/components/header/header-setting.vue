<template>
  <div class="header-setting">
    <a-tooltip placement="top" :title="$t('frame.themeSetting')">
      <SettingOutlined style="font-size: 18px;" @click="openSetting" />
    </a-tooltip>
    <CModal ref="settingModal" :title="$t('frame.setting')" width="470" mode="drawer" :footer="null">
      <h4 class="pb10 text-gray2">{{ $t('frame.theme') }}</h4>
      <a-space class="flex-x">
        <span class="nowrap">{{ $t('frame.selectTheme') }}：</span>
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
        <span class="nowrap">{{ $t('frame.menuLayout') }}：</span>
        <a-segmented v-model:value="settingStore.menuLayout" :options="menuLayoutOptions">
          <template #label="{ value, payload }">
            <div class="flex-y-center gap5 pt5">
              <component :is="payload.icon" class="menu-layout-icon" width="90" height="60" />
              <div>{{ payload.label }}</div>
            </div>
          </template>
        </a-segmented>
      </a-space>
      <a-space class="flex-x mt20">
        <span>{{ $t('frame.dark') }}：</span>
        <div class="border radius6">
          <ModeSwitch />
        </div>
      </a-space>
      <a-space class="flex-x mt20">
        <span>{{ $t('frame.modeAnimate') }}：</span>
        <a-segmented v-model:value="settingStore.modeAnimate" :options="modeAniOptions" />
      </a-space>
      <a-space class="flex-x mt20">
        <span>{{ $t('frame.componentSize') }}：</span>
        <a-segmented v-model:value="settingStore.componentSize" :options="sizeOptions" />
      </a-space>
      <a-space class="flex-x mt20">
        <span>{{ $t('frame.radiusLayout') }}：</span>
        <a-switch v-model:checked="settingStore.useRadius" />
      </a-space>
      <a-space class="flex-x mt20">
        <span>{{ $t('frame.useTabs') }}：</span>
        <a-switch v-model:checked="settingStore.useTabs" />
      </a-space>
      <a-space class="flex-x mt20">
        <span>{{ $t('frame.useDynamicPageTitle') }}：</span>
        <a-switch v-model:checked="settingStore.useDynamicPageTitle" />
      </a-space>
      <h4 class="mt20 text-gray2">{{ $t('frame.lang') }}</h4>
      <a-space class="flex-x mt20">
        <span>{{ $t('frame.selectLang') }}：</span>
        <a-select v-model:value="settingStore.locale" style="width: 150px;" @change="handleLocalChange">
          <a-select-option
            v-for="lang in langOptions"
            :key="lang.value"
            :value="lang.value"
          >
            <div class="flex-x x-middle">
              <img v-if="lang.image" :src="lang.image" class="radius3" style="height: 16px;" >
              <span class="ml8">{{ lang.label }}</span>
            </div>
          </a-select-option>
        </a-select>
      </a-space>
      <h4 class="mt20 text-gray2">{{ $t('frame.other') }}</h4>
      <a-space class="flex-x mt20">
        <span>{{ $t('frame.showWeather') }}：</span>
        <a-switch v-model:checked="settingStore.useWeather" />
      </a-space>
    </CModal>
  </div>
</template>

<script setup>
import { useSettingStore } from '@/stores/setting-store.js'
import { SettingOutlined } from '@ant-design/icons-vue'
import { langOptions } from '@/locales/index'
import Top from './icons/top.vue'
import TopLeft from './icons/top-left.vue'
import Left from './icons/left.vue'
import ModeSwitch from './mode-switch.vue'

const settingStore = useSettingStore()
const settingModal = ref()
const currColors = computed(() => Object.entries(settingStore.theme?.token))
const { locale, t } = useI18n()
const menuLayoutOptions = [
  { value: 'top', payload: { label: t('frame.top'), icon: Top } },
  { value: 'left', payload: { label: t('frame.left'), icon: Left } },
  { value: 'top-left', payload: { label: t('frame.topLeft'), icon: TopLeft } },
]
const modeAniOptions = [
  { label: t('frame.modeAnimateFade'), value: 'fade' },
  { label: t('frame.modeAnimateCircle'), value: 'circle' }
]
const sizeOptions = [
  { label: t('frame.small'), value: 'small' },
  { label: t('frame.middle'), value: 'middle' },
  { label: t('frame.large'), value: 'large' },
]

const openSetting = () => {
  settingModal.value.open()
}
const closeSetting = () => {
  settingModal.value.close()
}

const handleChange = name => {
  settingStore.setThemeByName(name)
}
const handleLocalChange = lc => {
  settingStore.setLocale(lc)
  locale.value = lc
}
</script>

<style lang="less" scoped>
.color-box {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 3px;
}
.menu-layout-icon {
  padding: 2px;
  transition: all 0.3s;
  border-radius: var(--ant-borderRadius);
  &:hover, &.is-active {
    box-shadow: 0 0 0 3px var(--ant-colorPrimary);
  }
}
</style>
