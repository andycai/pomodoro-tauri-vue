<script setup lang="ts">
import { readTextFile } from '@tauri-apps/api/fs'
import { resolveResource } from '@tauri-apps/api/path'
import { convertFileSrc } from "@tauri-apps/api/tauri"
import { onBeforeMount } from 'vue'
import Appbar from './components/appbar.vue'
import Footbar from './components/footbar.vue'
import TimeCounter from './components/TimeCounter.vue'
import { DefaultWorkDuration, Keys, Tasks, dataJsonURL, diAudioPaths, endAudioPaths } from './config'
import { addAudio, addEndAudio } from './utils'
import { getIntDefault, initItem } from './store/local'
import appStore from './store'
import { storeToRefs } from 'pinia'

const { changeTheme, initData } = appStore.main
const { themeStyle } = storeToRefs(appStore.main)

onBeforeMount( async () => {
  initData(
    getIntDefault(Keys.today(), 0),
    getIntDefault(Keys.total(Tasks.default), 0),
    getIntDefault(Keys.defaultWorkDuration, DefaultWorkDuration)
  )
  const resourcePath = await resolveResource(dataJsonURL);
  const data = JSON.parse(await readTextFile(resourcePath));
  initItem(Keys.defaultWorkDuration, data.defaultWorkDuration.toString())
  initItem(Keys.defaultBreakDuration, data.defaultBreakDuration.toString())

  for (const v of diAudioPaths) {
    const audioPath = await resolveResource(v)
    const audio = new Audio(convertFileSrc(audioPath))
    audio.loop = true
    addAudio(v, audio)
  }

  for (const v of endAudioPaths) {
    const audioPath = await resolveResource(v)
    addEndAudio(v, new Audio(convertFileSrc(audioPath)))
  }
})

</script>

<template>
  <div :class="themeStyle">
    <Appbar />
    <TimeCounter />
    <Footbar @change-theme="changeTheme" />
  </div>
</template>

<style scoped>
</style>