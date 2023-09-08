<script setup lang="ts">
import { readTextFile } from '@tauri-apps/api/fs'
import { resolveResource } from '@tauri-apps/api/path'
import { onBeforeMount } from 'vue'
import TimeCounterCom from './components/TimeCounterCom.vue'
import TodayCountCom from './components/TodayCountCom.vue'
import WorkTypeCom from './components/WorkTypeCom.vue'
import OperactionCom from './components/OperactionCom.vue'
import RefreshCom from './components/RefreshCom.vue'
import { DefaultWorkDuration, Keys, Tasks, dataJsonURL } from './config'
import { getIntDefault, initItem } from './store/local'
import { storeToRefs } from 'pinia'
import appStore from './store'

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
})

</script>

<template>
  <div :class="classContainer">
    <div className="flex flex-col">
      <TimeCounterCom />
      <div className="flex flex-row justify-center">
        <TodayCountCom />
        <div className="flex flex-row flex-1 grow justify-center space-x-1">
          <OperactionCom />
          <RefreshCom />
        </div>
        <WorkTypeCom />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>