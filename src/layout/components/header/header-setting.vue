<template>
  <div class="header-setting">
    <a-tooltip placement="top" :title="$t('frame.themeSetting')">
      <SettingOutlined class="font18" @click="openSetting" />
    </a-tooltip>
    <CModal ref="settingModal" :title="$t('frame.setting')" width="420" mode="drawer" :footer="null">
      <a-segmented v-model:value="settingTab" :options="settingTabs" block />
      <div class="mt20">
        <div v-show="settingTab === 'theme'">
          <Field :title="$t('frame.selectTheme')" :colon="false" layout="vertical">
            <div class="flex-x x-middle gap10 flex-wrap">
              <a-select v-model:value="settingStore.themeName" style="width: 150px;" @change="handleChange">
                <a-select-option
                  v-for="(item, index) in settingStore.themes"
                  :key="item.name"
                  :value="item.name"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
              <div class="flex-x x-middle gap5">
                <a-tooltip
                  v-if="!settingStore.theme.isDiy"
                  placement="top"
                  v-for="(kv, index) in currColors"
                  :key="index"
                >
                  <template #title>
                    <span>{{ kv[0] }}: {{ kv[1] }}</span>
                  </template>
                  <span class="color-box" :style="{ backgroundColor: kv[1] }" />
                </a-tooltip>
              </div>
            </div>
          </Field>
          <div v-if="settingStore.theme.isDiy">
            <div class="theme-diy flex-y pl15">
              <label v-for="[key, value] in Object.entries(settingStore.theme.token)" class="theme-diy__item flex-x-between gap10">
                <div class="label">
                  <span>{{ $t(`frame.${key}`) }}</span>
                  <span v-if="key === 'colorInfo'" class="em09 ml text-primary pointer" @click.prevent="settingStore.theme.token[key] = settingStore.theme.token.colorPrimary">
                    {{ $t('frame.usePrimaryColor') }}
                  </span>
                </div>
                <input type="color" :value="settingStore.theme.token[key]" class="value" @input="e => handleColorInput(e, key)" />
              </label>
            </div>
          </div>
          <div>
            <div class="bold em11 mt10 mb5">{{ $t('frame.menuLayout') }}</div>
            <div class="flex-x-around gap15 pl10">
              <div v-for="item in menuLayoutOptions" :key="item.value" class="flex-y-center gap5 pt5 pointer" @click="settingStore.menuLayout = item.value">
                <component :is="item.icon" class="menu-layout-icon" :class="{'is-checked': settingStore.menuLayout === item.value}" width="90" height="60" />
                <div>{{ item.label }}</div>
              </div>
            </div>
          </div>
          <Field v-if="settingStore.menuLayout === 'left'" :label="$t('frame.useBreadcrumbs')">
            <a-switch v-model:checked="settingStore.useBreadcrumbs" />
          </Field>
          <template v-else>
            <Field :label="$t('frame.firstMenuMode')">
              <a-segmented v-model:value="settingStore.firstMenuMode" :options="firstMenuModeOptions" />
            </Field>
            <Field :label="$t('frame.firstMenuAlign')">
              <a-segmented v-model:value="settingStore.firstMenuAlign" :options="firstMenuAlignOptions" />
            </Field>
          </template>
          <Field :title="$t('frame.other')" :label="$t('frame.dark')">
            <div class="border radius-ant inline-block">
              <ModeSwitch />
            </div>
          </Field>
          <Field :label="$t('frame.modeAnimate')">
            <a-segmented v-model:value="settingStore.modeAnimate" :options="modeAniOptions" />
          </Field>
          <Field :label="$t('frame.useTabs')">
            <a-switch v-model:checked="settingStore.useTabs" />
          </Field>
          <Field :label="$t('frame.tabAnimate')">
            <a-segmented v-model:value="settingStore.tabAnimate" :options="tabAniOptions" />
          </Field>
          <Field :label="$t('frame.componentSize')">
            <a-segmented v-model:value="settingStore.componentSize" :options="sizeOptions" />
          </Field>
          <Field :label="$t('frame.radiusLayout')">
            <a-switch v-model:checked="settingStore.useRadius" />
          </Field>
          <Field :label="$t('frame.useTableBorder')">
            <a-switch v-model:checked="settingStore.useTableBorder" />
          </Field>
          <Field :label="$t('frame.useThinLine')" :extra="$t('frame.useThinLineExtra')">
            <a-switch v-model:checked="settingStore.useThinLine" />
          </Field>
        </div>
        <div v-show="settingTab === 'other'">
          <Field :title="$t('frame.lang')" :label="$t('frame.selectLang')">
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
          </Field>
          <Field :title="$t('frame.other')" :label="$t('frame.showWeather')">
            <a-switch v-model:checked="settingStore.useWeather" />
          </Field>
          <Field :label="$t('frame.useDynamicPageTitle')">
            <a-switch v-model:checked="settingStore.useDynamicPageTitle" />
          </Field>
          <Field :label="$t('frame.useWatermark')">
            <a-switch v-model:checked="settingStore.useWatermark" />
          </Field>
          <Field v-if="settingStore.isCn" :label="$t('frame.useWanSplit')">
            <a-switch v-model:checked="settingStore.useWanSplit" />
          </Field>
        </div>
      </div>
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
import Field from './field.vue'

const settingStore = useSettingStore()
const settingModal = ref()
const currColors = computed(() => Object.entries(settingStore.theme?.token))
const { t } = useI18n()
const menuLayoutOptions = computed(() => [
  { value: 'top', label: t('frame.top'), icon: Top },
  { value: 'left', label: t('frame.left'), icon: Left },
  { value: 'top-left', label: t('frame.topLeft'), icon: TopLeft },
])
const firstMenuModeOptions = computed(() => [
  { label: t('frame.firstMenuModeMenu'), value: 'menu' },
  { label: t('frame.firstMenuModeButton'), value: 'button' },
])
const firstMenuAlignOptions = computed(() => [
  { label: t('frame.firstMenuAlignLeft'), value: 'start' },
  { label: t('frame.firstMenuAlignCenter'), value: 'center' },
  { label: t('frame.firstMenuAlignRight'), value: 'end' },
])
const modeAniOptions = computed(() => [
  { label: t('frame.modeAnimateFade'), value: 'fade' },
  { label: t('frame.modeAnimateCircle'), value: 'circle' },
  { label: t('frame.modeAnimateLine'), value: 'line' },
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
const settingTab = ref('theme')
const settingTabs = computed(() => [
  { label: t('frame.theme'), value: 'theme' },
  { label: t('frame.other'), value: 'other' },
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
}
const timer = null
const handleColorInput = (e, key) => {
  clearTimeout(timer)
  setTimeout(() => {
    settingStore.theme.token[key] = e.target.value
  }, 2000)
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
  &.is-checked, &:hover {
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
    .value {
      border-color: var(--ant-colorBorderSecondary);
      background-color: var(--ant-colorBgContainer);
    }
  }
}
</style>
