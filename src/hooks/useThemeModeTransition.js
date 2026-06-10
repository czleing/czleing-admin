/**
 * 主题明暗切换动画
 * @returns 
 */
export function useThemeModeTransition() {
  const isTransitioning = ref(false)
  async function transitionTheme(changeThemeFn, reverse = false) {
    if (isTransitioning.value) return
    isTransitioning.value = true
    const canvas = await html2canvas(document.documentElement, {
      useCORS: true,       // 解决跨域图片渲染问题
      scale: window.devicePixelRatio, // 适配设备像素比，高清图片
      backgroundColor: null, // 透明背景（如需白色改为 #fff）
      logging: true       // 关闭控制台日志
    })
    changeThemeFn && changeThemeFn()
    const imageData = canvas.toDataURL('image/png')
    const cover = document.createElement('div')
    let direction = `transparent var(--percent), black var(--percent)`
    if (reverse) {
      direction = `black var(--percent), transparent var(--percent)`
    }
    cover.style.cssText = `
      position: fixed;
      left: 0; top: 0;
      width: 100vw;
      height: 100vh;
      z-index: 999999;
      pointer-events: none;
      background-image: url(${imageData});
      background-size: cover;
      background-position: center;
      --percent: 0%;
      mask-image: radial-gradient(circle at 80% 30%, ${direction});
      animation: theme-transition .8s;
      animation-direction: ${reverse ? 'reverse' : ''};
      `
    document.body.appendChild(cover)

    setTimeout(() => {
      document.body.removeChild(cover)
      isTransitioning.value = false
    }, 800)
  }


  return {
    transitionTheme,
    isTransitioning
  }
}