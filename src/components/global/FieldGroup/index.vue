<!-- 字段分组-组件 -->
<template>
  <div class="field-group" :class="{ 'is-expand': showContainer }">
    <div v-if="title" class="field-group__title flex-x-between"
      :style="{ backgroundColor: token.colorFillTertiary, border: `solid 1px ${token.colorBorder}` }"
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
      <div v-if="$slots.default" v-show="showContainer" class="field-group__container px10 pt15 pb2" :style="{ borderColor: token.colorBorder }">
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
  margin-bottom: 15px;
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
    border-style: solid;
    border-width: 0 1px 1px 1px;
    border-radius: 0 0 5px 5px;
  }
  &.is-expand {
    .field-group__title {
      border-radius: 5px 5px 0 0;
    }
  }
}
</style>
