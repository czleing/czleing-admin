<template>
  <div class="header-setting">
    <a-tooltip placement="top" :title="$t('frame.themeSetting')">
      <SettingOutlined style="font-size: 18px;" @click="openSetting" />
    </a-tooltip>
  </div>
  <CModal ref="settingModal" :title="$t('frame.setting')" width="450" mode="drawer" :footer="null">
    <h4 class="pb10 text-gray2">{{ $t('frame.theme') }}</h4>
    <a-space class="flex-x">
      <span>{{ $t('frame.selectTheme') }}：</span>
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
      <span>{{ $t('frame.componentSize') }}：</span>
      <a-select v-model:value="settingStore.componentSize" style="width: 150px;">
        <a-select-option value="small">{{ $t('frame.small') }}</a-select-option>
        <a-select-option value="middle">{{ $t('frame.middle') }}</a-select-option>
        <a-select-option value="large">{{ $t('frame.large') }}</a-select-option>
      </a-select>
    </a-space>
    <a-space class="flex-x mt20">
      <span>{{ $t('frame.dark') }}：</span>
      <a-switch v-model:checked="isDark" checked-children="Dark" un-checked-children="Light" @change="changeMode"></a-switch>
    </a-space>
    <a-space class="flex-x mt20">
      <span>{{ $t('frame.radiusLayout') }}：</span>
      <a-switch v-model:checked="settingStore.useRadius" />
    </a-space>
    <a-space class="flex-x mt20">
      <span>{{ $t('frame.menuLayout') }}：</span>
      <a-radio-group v-model:value="settingStore.menuLayout">
        <a-radio value="top">{{ $t('frame.top') }}</a-radio>
        <a-radio value="left">{{ $t('frame.left') }}</a-radio>
        <a-radio value="top-left">{{ $t('frame.topLeft') }}</a-radio>
      </a-radio-group>
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
          v-for="lang in settingStore.langOptions"
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
</template>

<script setup>
import { useSettingStore } from '@/stores/setting-store.js'
import { SettingOutlined } from '@ant-design/icons-vue'

const settingStore = useSettingStore()
const settingModal = ref()
const isDark = ref(settingStore.isDark)
const currColors = computed(() => Object.entries(settingStore.theme?.token))
const { locale } = useI18n()

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
</style>
