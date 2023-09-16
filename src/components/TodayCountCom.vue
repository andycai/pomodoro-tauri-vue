<script setup lang="ts">
import { storeToRefs } from 'pinia'
import appStore from '../store'
import { changeAudio, playAudio } from '../utils';
import { computed } from 'vue';
import { WorkType } from '../config';

const { today, total, workType } = storeToRefs(appStore.main)
const className = "flex flex-row flex-none ml-2 w-20"
console.log("render today count: ", today.value, total.value)

const classIcon = computed(() => {
  return workType.value === WorkType.Work ? "clock-outline" : "coffee-outline"
})

</script>

<template>
  <div :class="className">
    <mdicon :name="classIcon" @click="playAudio(changeAudio())" :width="24" :height="24" />
    <span class="text-xs pt-2">{{ total }}/{{ today }}</span>
  </div>
</template>