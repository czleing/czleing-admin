/**
 * 主题明暗切换动画
 * @returns 
 */
export function useThemeModeTransition() {
  const isTransitioning = ref(false)
  async function transitionTheme(changeThemeFn) {
    if (isTransitioning.value) return
    isTransitioning.value = true
    const { clientX: x, clientY: y } = window.event || { clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 }
    const canvas = await htmlToCanvas(document.documentElement)
    const imageData = canvas.toDataURL('image/png')
    const cover = document.createElement('div')
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
      -webkit-mask-image: radial-gradient(circle at ${x}px ${y}px, transparent 0%, black 0%);
      mask-image: radial-gradient(circle at ${x}px ${y}px, transparent 0%, black 0%);
      transition: all 0s;
      animation: theme-transition 700ms cubic-bezier(0.25, 0.1, 0.25, 1);
    `
    const style = document.createElement('style')
    style.innerHTML = `
      @keyframes theme-transition {
        0% { -webkit-mask-size: 1px; mask-size: 1px; }
        100% { -webkit-mask-size: 300vw; mask-size: 300vw; }
      }
    `
    document.head.appendChild(style)
    document.body.appendChild(cover)

    changeThemeFn()

    setTimeout(() => {
      document.body.removeChild(cover)
      document.head.removeChild(style)
      isTransitioning.value = false
    }, 700)
  }

  function htmlToCanvas(element) {
    return new Promise(async (resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const width = window.innerWidth
      const height = window.innerHeight

      canvas.width = width
      canvas.height = height

      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
          <foreignObject width="100%" height="100%">
            <div xmlns="http://www.w3.org/1999/xhtml" style="margin:0;padding:0;background:inherit;color:inherit;">
              ${document.documentElement.outerHTML}
            </div>
          </foreignObject>
        </svg>
      `

      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0)
        resolve(canvas)
      }
      img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`
    })
  }

  return {
    transitionTheme,
    isTransitioning
  }
}