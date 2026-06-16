<!-- 首页 -->
<template>
  <div class="home-page">
    <div class="ml20 mt20">首页</div>
    <div class="w30p mt20">
      <div class="bold">文字转语音</div>
      <div class="mt10 flex-x gap10">
        <a-input v-model:value="inputStr" placeholder="文字内容" />
        <a-input-number v-model:value="inputTime" placeholder="播放次数" />
        <a-button :loading="isPlaying" @click="text2voice">播放</a-button>
      </div>
      <div class="bold mt20">语音转文字</div>
      <div class="mt10 flex-x gap10">
        <a-input-group compact>
          <a-input v-model:value="text" placeholder="请输入或录入" style="width: auto;flex: auto;" />
          <a-button type="primary" @click="start">
            <PauseCircleFilled v-if="loading" />
            <AudioFilled v-else />
          </a-button>
        </a-input-group>
      </div>
      <div class="bold mt20">录音</div>
      <div class="mt">
        <a-button @click="startRecord" :disabled="isRecording">开始录音</a-button>
        <a-button @click="stopRecord" v-if="isRecording">停止录音</a-button>
        <a-button @click="playAudio">试听</a-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import useVoiceInput from '@/hooks/useVoiceInput';
import useSpeak from '@/hooks/useSpeak';
import useRecordAudio from '@/hooks/useRecordAudio'
import { AudioFilled, PauseCircleFilled } from '@ant-design/icons-vue';

defineOptions({
  name: 'HomePage'
})
/** 文字转语音 */
const { speak, isPlaying } = useSpeak()
const inputStr = ref('你好，hello')
const inputTime = ref(2)
function text2voice () {
  if (!inputStr.value) return
  speak(inputStr.value, inputTime.value)
}

// 语音输入
const { loading, text, start, stop } = useVoiceInput()

/** 录音 */
const { isRecording, startRecord, stopRecord, playAudio, uploadAudio } = useRecordAudio()

</script>

<style lang="less" scoped>
.home-page {
  .title {
  }
}
</style>
