<script setup lang="ts">
import { useMainStore } from '../store/main';

const store = useMainStore()

</script>

<template>
    <div class="flex flex-col items-center font-black" data-tauri-drag-region>
      <h1 class="text-7xl" data-tauri-drag-region>{{ store.minuteShow }}</h1>
      <h4 class="text-7xl" data-tauri-drag-region>{{ store.secondShow }}</h4>
    </div>
</template>