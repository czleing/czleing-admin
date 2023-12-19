<!-- c-page 表格行操作按钮组件 -->
<template>
  <template v-if="action.confirm">
    <!-- 带确认框 -->
    <a-popconfirm
      placement="left"
      :title="`确定对该条数据执行${ action.name ? `[${ action.name }]` : '此' }操作吗？`"
      @confirm="action.callback({ record })"
    >
      <component v-if="action.customRender" :is="action.customRender({ record })" v-hasPermi="action.permission" />
      <a v-else-if="action.name" v-hasPermi="action.permission" href="javascript:;">{{ action.name }}</a>
    </a-popconfirm>
  </template>
  <template v-else>
    <component v-if="action.customRender" :is="action.customRender({ record })" v-hasPermi="action.permission" />
    <a v-else-if="action.name" v-hasPermi="action.permission" href="javascript:;" @click="action.callback({ record })">{{ action.name }}</a>
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
