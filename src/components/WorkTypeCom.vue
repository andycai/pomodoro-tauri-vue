<script setup lang="ts">
import { storeToRefs } from 'pinia'
import appStore from '../store'
import { WorkType } from '../config';

const { workType } = storeToRefs(appStore.main)
const className = "flex flex-row-reverse flex-none mr-2 w-20"
console.log("render Work Type", workType.value)
</script>

<template>
  <div :class="className">
    <template v-if="workType === WorkType.Work">
      <mdicon name="laptop" :width="24" :height="24" />
    </template>
    <template v-else>
      <mdicon name="coffee-outline" :width="24" :height="24" />
    </template>
  </div>
</template>