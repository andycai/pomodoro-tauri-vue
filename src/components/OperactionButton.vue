<script setup lang="ts">
import { storeToRefs } from 'pinia'
import appStore from '../store'
import { Status } from '../config'
import Pause from '../icons/pause.vue'
import Play from '../icons/play.vue'

const { status } = storeToRefs(appStore.main)
const { tick } = appStore.main 

</script>

<template>
    <button class="flex flex-row justify-center basis-1/2" title="Play or Pause" @click="tick">
    <template v-if="status === Status.Tick">
      <Pause :width="22" :height="22" />
    </template>
    <template v-else>
      <Play :width="22" :height="22" />
    </template>
    </button>
</template>