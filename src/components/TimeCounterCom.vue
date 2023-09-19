<script setup lang="ts">
import appStore from '../store';
import { storeToRefs } from 'pinia';

const { minuteShow, secondShow } = storeToRefs(appStore.main)
// console.log("render TimeCounter", timeShow.value);

</script>

<template>
    <div class="flex flex-col items-center font-black" data-tauri-drag-region>
      <h1 class="text-7xl" data-tauri-drag-region>{{ minuteShow }}</h1>
      <h4 class="text-7xl" data-tauri-drag-region>{{ secondShow }}</h4>
    </div>
</template>