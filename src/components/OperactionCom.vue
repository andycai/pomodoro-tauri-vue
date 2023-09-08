<script setup lang="ts">
import { storeToRefs } from 'pinia';
import appStore from '../store';
import { Status } from '../config';

console.log("render Operaction")
const { status } = storeToRefs(appStore.main)
const { tick } = appStore.main 
const className = "cursor-pointer"

</script>

<template>
    <template v-if="status === Status.Tick">
      <mdicon :class="className" name="pause-circle-outline" :width="24" :height="24" @click="tick" />
    </template>
    <template v-else>
      <mdicon :class="className" name="play-circle-outline" :width="24" :height="24" @click="tick" />
    </template>
</template>