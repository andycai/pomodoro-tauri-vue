<script setup lang="ts">
import { readTextFile } from '@tauri-apps/api/fs'
import { resolveResource } from '@tauri-apps/api/path'
import { convertFileSrc } from "@tauri-apps/api/tauri"
import { listen } from '@tauri-apps/api/event'
import { onBeforeMount } from 'vue'
import Appbar from './components/appbar.vue'
import Footbar from './components/footbar.vue'
import TimeCounter from './components/TimeCounter.vue'
import { DefaultWorkDuration, Keys, Tasks, dataJsonURL, diAudioPaths, endAudioPaths } from './config'
import { addAudio, addEndAudio } from './utils'
import { getIntDefault, initItem, saveItem } from './store/local'
import { useMainStore } from './store/main'

interface DurationPayload {
  duration: number,
  break: number,
}

const store = useMainStore()

onBeforeMount( async () => {
  store.initData(
    getIntDefault(Keys.today(), 0),
    getIntDefault(Keys.total(Tasks.default), 0),
    getIntDefault(Keys.defaultWorkDuration, DefaultWorkDuration)
  )

  await listen<DurationPayload>('event-change-duration', (event) => {
    saveItem(Keys.defaultWorkDuration, (event.payload.duration*60).toString())
    store.updateDuration()
    // console.log("event:%s, payload:%s", event.event, event.payload.duration)
  })

  await listen<DurationPayload>('event-change-break', (event) => {
    saveItem(Keys.defaultBreakDuration, (event.payload.break*60).toString())
    store.updateDuration()
    // console.log("event:%s, payload:%s", event.event, event.payload.break)
  })

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
  <div :class="store.themeStyle">
    <Appbar />
    <TimeCounter />
    <Footbar @change-theme="store.changeTheme" />
  </div>
</template>

<style scoped>
</style>