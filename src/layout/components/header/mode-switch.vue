<!-- 切换明暗色系相关 -->
<template>
  <a-tooltip placement="top" :title="$t('frame.themeMode')">
    <div class="mode-switch pointer" :class="{'is-dark': isBtnDark}" @click="changeMode">
      <div class="stars"></div>
      <div class="sun-moon"></div>
      <div class="cloud"></div>
    </div>
  </a-tooltip>
</template>
<script setup>
import { useSettingStore } from '@/stores/setting-store.js'
const settingStore = useSettingStore()
const isBtnDark = ref(settingStore.isDark)
const root = document.documentElement;
let maxR = 2000
watch(
  () => settingStore.isDark,
  () => {
    isBtnDark.value = settingStore.isDark
  }
)

async function changeMode (e) {
  const x = e.clientX, y = e.clientY;
  maxR = parseInt(Math.hypot(window.innerWidth, window.innerHeight) + '');
  if (!document.startViewTransition) {
    isBtnDark.value = !isBtnDark.value
    await sleep(200)
    settingStore.toggleMode()
    return
  }
  isBtnDark.value = !isBtnDark.value;
  await sleep(200);
  const vt = document.startViewTransition(async () => {
    settingStore.toggleMode();
    await nextTick();
  })
  vt.ready.then(() => playEffect(x, y))
}
function playEffect(x, y) {
  let frames = null
  const isToDark = settingStore.isDark
  if (settingStore.modeAnimate === 'circle') {
    // 亮 -> 暗， 暗色(new)在上，由小到大
    // 暗 -> 亮， 暗色(old)在上，由大到小
    const start = `circle(0px at ${x}px ${y}px)`;
    const end = `circle(${maxR}px at ${x}px ${y}px)`;
    frames = [
      { clipPath: isToDark ? start : end }, // 0%
      { clipPath: isToDark ? end : start } // 100%
    ]
  } else {
    frames = [
      { filter: isToDark ? 'blur(10px)' : 'blur(0px)', opacity: isToDark ? 0 : 1 },
      { filter: isToDark ? 'blur(0px)' : 'blur(10px)', opacity: isToDark ? 1 : 0 }
    ]
  }
  isBtnDark.value && root.animate([{ opacity: 1, filter: 'none', clipPath: 'none' }], {
    duration: 0,
    pseudoElement: '::view-transition-old(root)',
    fill: 'both'
  });
  frames && root.animate(frames, {
    duration: 650,
    easing: 'linear',
    pseudoElement: isToDark ? '::view-transition-new(root)' : '::view-transition-old(root)',
    fill: 'both'
  });
}
</script>
<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none !important;
  mix-blend-mode: normal;
}
::view-transition-old(root) {
  z-index: 99;
}
::view-transition-new(root) {
  z-index: 1;
}
[theme='dark']::view-transition-old(root)  {
  z-index: 1;
}
[theme='dark']::view-transition-new(root)  {
  z-index: 99;
}
</style>
<style scoped lang="less">
.mode-switch {
  --mode-color: #ffd446;
  width: 40px;
  height: 40px;
  overflow: hidden;
  position: relative;
  .stars {
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(circle 2px, var(--mode-color) 80%, transparent 80%),
      radial-gradient(circle 2px, var(--mode-color) 80%, transparent 80%),
      radial-gradient(circle 2px, var(--mode-color) 80%, transparent 80%),
      radial-gradient(circle 2px, var(--mode-color) 80%, transparent 80%),
      radial-gradient(circle 2px, var(--mode-color) 80%, transparent 80%),
      radial-gradient(circle 2px, var(--mode-color) 80%, transparent 80%),
      radial-gradient(circle 2px, var(--mode-color) 80%, transparent 80%),
      radial-gradient(circle 2px, var(--mode-color) 80%, transparent 80%);
    background-position:
      4px 18px,
      8px 8px,
      18px 4px,
      28px 8px,
      32px 18px,
      28px 28px,
      18px 32px,
      8px 28px;
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
    box-shadow: 30px 30px 0 0 var(--mode-color);
    transition: all .2s;
  }
  .cloud {
    position: absolute;
    inset: 0;
    transition: all .2s;
    &::before, &::after {
      content: '';
      position: absolute;
      border-radius: 30px;
      background-color: rgba(255, 219, 208, 0.42);
      backdrop-filter: blur(3px);
      border: solid 1px white;
    }
    &::before {
      width: 33px;
      height: 33px;
      left: -8px;
      bottom: -15px;
    }
    &::after {
      width: 24px;
      height: 24px;
      right: -5px;
      bottom: -14px;
    }
  }
  &.is-dark {
    --mode-color: #81fbff;
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
      box-shadow: 8px 8px 0 0 var(--mode-color);
    }
    .cloud {
      transform: translateY(100%);
    }
  }
}
</style>