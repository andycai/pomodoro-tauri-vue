<script setup lang="ts">
import { Status } from '../config'
import Pause from '../icons/pause.vue'
import Play from '../icons/play.vue'
import { useMainStore } from '../store/main'

const store = useMainStore()

</script>

<template>
    <button class="flex flex-row justify-center basis-1/2" title="Play or Pause" @click="store.tick">
    <template v-if="store.status === Status.Tick">
      <Pause :width="22" :height="22" />
    </template>
    <template v-else>
      <Play :width="22" :height="22" />
    </template>
    </button>
</template>