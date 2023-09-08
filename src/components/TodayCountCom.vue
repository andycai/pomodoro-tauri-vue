<script setup lang="ts">
import { storeToRefs } from 'pinia'
import appStore from '../store'

const { today, total } = storeToRefs(appStore.main)
const className = "flex flex-row flex-none ml-2 w-20"
console.log("render today count: ", today.value, total.value)

</script>

<template>
  <div :class="className">
    <mdicon name="clock-outline" :width="24" :height="24" />
    <span className="text-xs pt-2">{{ total }}/{{ today }}</span>
  </div>
</template>