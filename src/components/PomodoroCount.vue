<script setup lang="ts">
import { changeAudio, playAudio } from '../utils';
import { ref } from 'vue'
import { Status } from '../config'
import Volume from '../icons/volume.vue'
import VolumeMute from '../icons/volume-mute.vue'
import { useMainStore } from '../store/main';

const store = useMainStore()

const musicOff = ref(false)

function change() {
  if (store.status === Status.Tick) {
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
  <span class="text-xs pt-0">{{ store.total }}/{{ store.today }}</span>
</template>