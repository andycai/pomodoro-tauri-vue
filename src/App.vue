<script setup lang="ts">
import { readTextFile } from '@tauri-apps/api/fs'
import { resolveResource } from '@tauri-apps/api/path'
import { onBeforeMount } from 'vue'
import TimeCounterCom from './components/TimeCounterCom.vue'
import TodayCountCom from './components/TodayCountCom.vue'
import OperactionCom from './components/OperactionCom.vue'
import RefreshCom from './components/RefreshCom.vue'
import { DefaultWorkDuration, Keys, Tasks, dataJsonURL, diAudioPaths, endAudioPaths } from './config'
import { getIntDefault, initItem } from './store/local'
import { storeToRefs } from 'pinia'
import appStore from './store'
import { convertFileSrc } from "@tauri-apps/api/tauri"
import { addAudio, addEndAudio } from './utils'
import { appWindow } from '@tauri-apps/api/window'

const { classContainer } = storeToRefs(appStore.main)
const { initData } = appStore.main

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

  for (let v of diAudioPaths) {
    // console.log("path: ", v)
    const audioPath = await resolveResource(v)
    const audio = new Audio(convertFileSrc(audioPath))
    audio.loop = true
    addAudio(v, audio)
  }

  for (let v of endAudioPaths) {
    const audioPath = await resolveResource(v)
    addEndAudio(v, new Audio(convertFileSrc(audioPath)))
  }
})

</script>

<template>
  <div :class="classContainer">
    <mdicon name="close" class="cursor-pointer absolute right-0" @click="() => appWindow.close()" width="14" height="14" />
    <div className="flex flex-col">
      <TimeCounterCom />
      <div className="flex flex-row justify-center mt-1">
        <TodayCountCom />
        <div className="flex flex-row flex-1 grow justify-end space-x-1 mr-1">
          <RefreshCom />
          <OperactionCom />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>