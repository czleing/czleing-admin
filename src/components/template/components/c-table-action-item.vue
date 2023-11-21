<!-- c-page 表格行操作按钮组件 -->
<template>
  <template v-if="action.confirm">
    <a-popconfirm
      :title="`确定要执行[${action.name}]操作吗？`"
      @confirm="action.callback({ record })"
    >
      <a v-if="action.name" v-hasPermi="action.permission" href="javascript:;">{{ action.name }}</a>
      <component v-else-if="action.customRender" :is="action.customRender({ record })" />
    </a-popconfirm>
  </template>
  <template v-else>
    <a v-if="action.name" v-hasPermi="action.permission" href="javascript:;" @click="action.callback({ record })">{{ action.name }}</a>
    <component v-else-if="action.customRender" :is="action.customRender({ record })" />
  </template>
</template>

<script setup>
const props = defineProps({
  action: Object,
  record: Object
})
</script>

<style lang="scss" scoped>
</style>
