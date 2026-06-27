/**
 * 语音输入，语音转文字
 * @param lang 语言，zh, en，非绝对，填入en也可识别中文，只是部分文字会识别成拼音
 * @returns
 */
export default function useVoiceInput (lang = 'zh') {
  const loading = ref(false) // 是否正在识别
  const text = ref('') // 识别结果
  const rec = ref() // 识别器
  let lastLength = 0 // 最后识别结果长度
  if (window.webkitSpeechRecognition) {
    rec.value = new window.webkitSpeechRecognition()
  } else if (window.SpeechRecognition) {
    rec.value = new window.SpeechRecognition()
  } else {
    return
  }

  function onResult (event) {
    // 这个事件会把前面识别的结果都返回回来，所以需要取最后一个识别结果
    const length = event.results.length;
    // 没有新的识别结果的时候，事件也会触发，所以这里判断一下如果没有新的识别结果，就不取最后一个识别结果了。
    if (lastLength === length) {
      return
    }
    lastLength = length
    // 获取最后一个识别结果
    const transcript = event.results[length - 1]?.[0]?.transcript

    if (transcript) {
      text.value += transcript
    }
  }

  onMounted(() => {
    rec.value.lang = lang // 设置语言
    /** 控制是为每次识别返回连续结果，还是仅返回单个结果。默认为单个(false)。	也就是说如果这个属性设置为false，说一段话后会自动停止识别。如果为true，会一直识别，直到调用stop或abort方法停止识别。 */
    rec.value.continuous = true // 开启连续识别
    /** 这个属性控制是否返回临时结果，true表示返回，false不返回。	如果为true，说话的时候会实时返回，如果为false，一段话结束后才返回。 */
    rec.value.interimResults = true // 开启实时识别

    rec.value.addEventListener('result', onResult)
  })

  function start () {
    if (loading.value) {
      stop()
      return
    }
    loading.value = true
    lastLength = 0
    rec.value.start()
  }

  function stop () {
    rec.value.stop()
    loading.value = false
  }

  onUnmounted(() => {
    rec.value?.removeEventListener('result', onResult)
  })
  return {
    start, // 开始识别
    stop, // 结束识别
    text,
    loading
  }
}
