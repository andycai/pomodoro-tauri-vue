<script setup lang="ts">
import { appWindow } from '@tauri-apps/api/window'
import PomodoroCount from './PomodoroCount.vue'
import Close from '../icons/close.vue'

</script>

<template>
   <div class="flex flex-row justify-between pt-1 px-1">
    <PomodoroCount />
    <button title="Close Window" class="flex flex-row justify-end space-x-1" @click="() => appWindow.close()">
      <Close />
    </button>
    </div>
</template>