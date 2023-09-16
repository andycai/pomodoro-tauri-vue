<script setup lang="ts">
import appStore from '../store';
import { storeToRefs } from 'pinia';
import { appWindow } from "@tauri-apps/api/window";

const { minuteShow, secondShow } = storeToRefs(appStore.main)
// console.log("render TimeCounter", timeShow.value);

function close() {
    appWindow.close();
}

</script>

<template>
    <div class="flex flex-col items-end font-black" data-tauri-drag-region>
      <h4 class="text-6xl mr-1" @click="close" data-tauri-drag-region>{{ secondShow }}</h4>
      <h1 class="text-8xl mr-1" data-tauri-drag-region>{{ minuteShow }}</h1>
    </div>
</template>