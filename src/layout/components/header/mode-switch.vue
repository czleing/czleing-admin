<!-- 切换明暗色系相关 -->
<template>
  <!-- <a-switch v-model:checked="isDark" checked-children="Dark" un-checked-children="Light" @change="changeMode"></a-switch> -->
  <div class="mode-switch pointer" :class="{'is-dark': isDark}" @click="changeMode">
    <div class="stars"></div>
    <div class="sun-moon"></div>
  </div>
</template>
<script setup>
import { useSettingStore } from '@/stores/setting-store.js'
const settingStore = useSettingStore()
const isDark = ref(settingStore.isDark)
const root = document.documentElement;

watch(
  () => settingStore.isDark,
  () => {
    isDark.value = settingStore.isDark
  }
)

async function changeMode (e) {
  const x = e.clientX, y = e.clientY;
  if (!document.startViewTransition) {
    isDark.value = !isDark.value
    settingStore.toggleMode()
    return
  }
  isDark.value = !isDark.value
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
    duration: 650,
    easing: 'linear',
    pseudoElement: isDark.value ? '::view-transition-new(root)' : '::view-transition-old(root)',
    fill: 'both'
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
  z-index: 999;
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
  z-index: 999;
}

</style>
<style scoped lang="less">
.mode-switch {
  width: 40px;
  height: 40px;
  overflow: visible;
  position: relative;
  transform: scale(0.7);
  .stars {
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(circle 2px, var(--ant-colorText) 80%, transparent 80%),
      radial-gradient(circle 2px, var(--ant-colorText) 80%, transparent 80%),
      radial-gradient(circle 2px, var(--ant-colorText) 80%, transparent 80%),
      radial-gradient(circle 2px, var(--ant-colorText) 80%, transparent 80%),
      radial-gradient(circle 2px, var(--ant-colorText) 80%, transparent 80%),
      radial-gradient(circle 2px, var(--ant-colorText) 80%, transparent 80%),
      radial-gradient(circle 2px, var(--ant-colorText) 80%, transparent 80%),
      radial-gradient(circle 2px, var(--ant-colorText) 80%, transparent 80%);
    background-position:
      4px 19px,
      8px 9px,
      18px 4px,
      28px 9px,
      32px 18px,
      28px 28px,
      19px 32px,
      9px 28px;
    background-size: 4px 4px;
    background-repeat: no-repeat;
    transition: all .2s;
  }
  .sun-moon {
    position: absolute;
    background-color: transparent;
    border-radius: 80%;
    left: -20px;
    top: -20px;
    width: 20px;
    height: 20px;
    box-shadow: 30px 30px 0 0 var(--ant-colorText);
    transition: all .2s;
  }
  &.is-dark {
    .stars {
      background-position:
        2px 15px,
        4px 6px,
        13px 13px,
        17px 7px,
        27px 8px,
        24px 3px,
        31px 4px,
        34px 10px;
      background-size: 1px 1px;
    }
    .sun-moon {
      transform: translate(22px, 22px);
      box-shadow: 8px 8px 0 0 var(--ant-colorText);
    }
  }
}
</style>