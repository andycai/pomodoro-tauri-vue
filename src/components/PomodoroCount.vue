<script setup lang="ts">
import { storeToRefs } from 'pinia'
import appStore from '../store'
import { changeAudio, playAudio } from '../utils';
import { ref } from 'vue'
import { Status } from '../config'
import Volume from '../icons/volume.vue'
import VolumeMute from '../icons/volume-mute.vue'

const { today, total, status } = storeToRefs(appStore.main)

const musicOff = ref(false)

function change() {
  if (status.value === Status.Tick) {
    musicOff.value = !changeAudio()
    playAudio(!musicOff.value)
  }
}

</script>

<template>
  <button title="Change Audio or Mute" @click="change">
    <template v-if="musicOff">
      <VolumeMute :width="16" :height="16" />
    </template>
    <template v-else>
      <Volume :width="16" :height="16" />
    </template>
  </button>
  <span class="text-xs pt-0">{{ total }}/{{ today }}</span>
</template>