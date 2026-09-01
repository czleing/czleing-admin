<!-- 设置-单个设置项容器组件 -->
<template>
  <div class="field">
    <div v-if="title" class="bold em11 mt10 mb5">{{ title }}</div>
    <div class="field__item flex-x-between gap10">
      <div v-if="label" class="label">{{ label }}</div>
      <div class="value" :class="{'flex-auto': !label}">
        <slot />
      </div>
    </div>
    <div v-if="extra" class="text-gray em09 tr mr10">
      <info-circle-filled />
      {{ extra }}
    </div>
  </div>
</template>
<script setup>
import { InfoCircleFilled } from '@ant-design/icons-vue';

const props = defineProps({
  title: String,
  label: String,
  extra: String,
})
</script>
<style scoped lang="less">
.field {
  margin: 8px 0;
  &__item {
    padding: 8px 10px;
    border-radius: var(--ant-borderRadiusLG);
    transition: background-color .3s;
    &:hover {
      background-color: color-mix(var(--ant-colorPrimary) 15%, transparent);
    }
  }
}
</style>