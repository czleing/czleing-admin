<template>
  <div class="header-setting">
    <a-tooltip placement="top" :title="$t('frame.themeSetting')">
      <SettingOutlined style="font-size: 18px;" @click="openSetting" />
    </a-tooltip>
    <CModal ref="settingModal" :title="$t('frame.setting')" width="500" mode="drawer" :footer="null">
      <a-form :labelCol="{ flex: '0 0 100px' }">
        <h4 class="pb10 text-gray2">{{ $t('frame.theme') }}</h4>
        <a-form-item :label="$t('frame.selectTheme')">
          <a-space>
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
              v-if="!settingStore.theme.isDiy"
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
        </a-form-item>
        <a-form-item v-if="settingStore.theme.isDiy" label=" " :colon="false">
          <div class="theme-diy flex-y">
            <label v-for="[key, value] in Object.entries(settingStore.theme.token)" class="theme-diy__item flex-x-between gap10">
              <div class="label">{{ $t(`frame.${key}`) }}</div>
              <input type="color" :value="settingStore.theme.token[key]" class="value" @change="e => settingStore.theme.token[key] = e.target.value" />
            </label>
          </div>
        </a-form-item>
        <a-form-item :label="$t('frame.menuLayout')">
          <a-segmented v-model:value="settingStore.menuLayout" :options="menuLayoutOptions">
            <template #label="{ value, payload }">
              <div class="flex-y-center gap5 pt5">
                <component :is="payload.icon" class="menu-layout-icon" width="90" height="60" />
                <div>{{ payload.label }}</div>
              </div>
            </template>
          </a-segmented>
        </a-form-item>
        <a-form-item :label="$t('frame.dark')">
          <div class="border radius-ant inline-block">
            <ModeSwitch />
          </div>
        </a-form-item>
        <a-form-item :label="$t('frame.modeAnimate')">
          <a-segmented v-model:value="settingStore.modeAnimate" :options="modeAniOptions" />
        </a-form-item>
        <a-form-item :label="$t('frame.useTabs')">
          <a-switch v-model:checked="settingStore.useTabs" />
        </a-form-item>
        <a-form-item :label="$t('frame.tabAnimate')">
          <a-segmented v-model:value="settingStore.tabAnimate" :options="tabAniOptions" />
        </a-form-item>
        <a-form-item :label="$t('frame.componentSize')">
          <a-segmented v-model:value="settingStore.componentSize" :options="sizeOptions" />
        </a-form-item>
        <a-form-item :label="$t('frame.radiusLayout')">
          <a-switch v-model:checked="settingStore.useRadius" />
        </a-form-item>
        <h4 class="mt20 text-gray2">{{ $t('frame.lang') }}</h4>
        <a-form-item :label="$t('frame.selectLang')">
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
        </a-form-item>
        <h4 class="mt20 text-gray2">{{ $t('frame.other') }}</h4>
        <a-form-item :label="$t('frame.showWeather')">
          <a-switch v-model:checked="settingStore.useWeather" />
        </a-form-item>
        <a-form-item :label="$t('frame.useDynamicPageTitle')">
          <a-switch v-model:checked="settingStore.useDynamicPageTitle" />
        </a-form-item>
      </a-form>
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
const menuLayoutOptions = computed(() => [
  { value: 'top', payload: { label: t('frame.top'), icon: Top } },
  { value: 'left', payload: { label: t('frame.left'), icon: Left } },
  { value: 'top-left', payload: { label: t('frame.topLeft'), icon: TopLeft } },
])
const modeAniOptions = computed(() => [
  { label: t('frame.modeAnimateFade'), value: 'fade' },
  { label: t('frame.modeAnimateCircle'), value: 'circle' }
])
const sizeOptions = computed(() => [
  { label: t('frame.small'), value: 'small' },
  { label: t('frame.middle'), value: 'middle' },
  { label: t('frame.large'), value: 'large' },
])
const tabAniOptions = computed(() => [
  { label: t('frame.tabAnimateNone'), value: '' },
  { label: t('frame.tabAnimateSlideRight'), value: 'slide-right' },
  { label: t('frame.tabAnimateFade'), value: 'fade' },
  { label: t('frame.tabAnimateScale'), value: 'scale' },
])

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
  background-color: var(--ant-colorBgContainer);
  &:hover {
    box-shadow: 0 0 0 3px var(--ant-colorPrimary);
  }
}
.theme-diy {
  &__item {
    background-color: transparent;
    padding: 5px;
    border-radius: var(--ant-borderRadius);
    transition: all .3s;
    &:hover {
      background-color: var(--ant-colorBgLayout);
    }
    .label {
      width: 100px;
    }
    .value {
      border-color: var(--ant-colorBorderSecondary);
      background-color: var(--ant-colorBgContainer);
    }
  }
}
</style>
