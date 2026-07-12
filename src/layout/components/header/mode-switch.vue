<!-- 切换明暗色系相关 -->
<template>
  <a-switch v-model:checked="isDark" checked-children="Dark" un-checked-children="Light" @change="changeMode"></a-switch>
</template>
<script setup>
import { useSettingStore } from '@/stores/setting-store.js'
const settingStore = useSettingStore()
const isDark = ref(settingStore.isDark)
const root = document.documentElement;

async function changeMode (val, e) {
  const x = e.clientX, y = e.clientY;
  if (!document.startViewTransition) {
    isDark.value = val
    settingStore.toggleMode()
    return
  }
  isDark.value = val
  await sleep(200)
  const vt = document.startViewTransition(async () => {
    settingStore.toggleMode()
    await nextTick();
  })
  vt.ready.then(() => playEffect(x, y))
}
function playEffect(x, y) {
  let frames = null
  if (settingStore.modeAnimate === 'circle') {
    // 亮 -> 暗， 暗色(new)在上，由小到大
    // 暗 -> 亮， 暗色(old)在上，由大到小
    const maxR = parseInt(Math.hypot(innerWidth, innerHeight) + '');
    const start = `circle(0px at ${x}px ${y}px)`;
    const end = `circle(${maxR}px at ${x}px ${y}px)`;
    frames = [
      { clipPath: isDark.value ? start : end }, // 0%
      { clipPath: isDark.value ? end : start } // 100%
    ]
  } else {
    frames = [
      { filter: isDark.value ? 'blur(10px)' : 'blur(0px)', opacity: isDark.value ? 0 : 1 },
      { filter: isDark.value ? 'blur(0px)' : 'blur(10px)', opacity: isDark.value ? 1 :0 }
    ]
  }
  frames && root.animate(frames, {
    duration: 1000,
    easing: 'linear',
    pseudoElement: isDark.value ? '::view-transition-new(root)' : '::view-transition-old(root)'
  });
}
</script>
<style lang="less">
::view-transition-old(root),
::view-transition-new(root) {
  animation: none !important;
  mix-blend-mode: normal;
}
::view-transition-old(root) {
  z-index: 99;
  // left: 30px;
  // top: 90px;
}
::view-transition-new(root) {
  z-index: 1;
  // left: 90px;
  // top: 30px;
}
[theme='dark']::view-transition-old(root)  {
  z-index: 1;
}
[theme='dark']::view-transition-new(root)  {
  z-index: 99;
}
</style>