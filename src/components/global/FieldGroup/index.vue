<!-- 字段分组-组件 -->
<template>
  <div class="field-group">
    <div v-if="title" class="field-group__title flex-x-between"
      :style="{ backgroundColor: token.colorFillTertiary }"
    >
      <div>
        <span class="flag" :style="{ backgroundColor: token.colorPrimary }"></span>
        <span class="bold em11">{{ title }}</span>
        <span class="ml10">{{ subTitle }}</span>
      </div>
      <span v-if="$slots.default" @click="toggle">
        <RightCircleOutlined class="pointer icon em12 text-gray" :class="{ 'is-show': showContainer}" />
      </span>
    </div>
    <Transition name="expand">
      <div v-if="$slots.default" v-show="showContainer" class="field-group__container pa10">
        <slot />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RightCircleOutlined } from '@ant-design/icons-vue'
import { useThemeToken } from '@/hooks/useThemeToken.js'

const props = defineProps({
  title: String,
  subTitle: String
})
const showContainer = ref(true)
const { token } = useThemeToken()

function toggle () {
  showContainer.value = !showContainer.value
}
</script>

<style lang="less" scoped>
.field-group {
  &__title {
    position: relative;
    padding: 8px 15px;
    border-radius: 5px;
    line-height: 1;
    &:hover {
      opacity: .8;
    }
    & .flag {
      display: inline-block;
      position: absolute;
      top: 6px;
      left: 2px;
      bottom: 6px;
      width: 5px;
      border-radius: 3px;
    }
    & .icon {
      transition: transform .2s;
      &.is-show {
        transform: rotate(90deg);
      }
    }
  }
  &__container {
    max-height: 800px;
    overflow: auto;
  }
}
</style>
