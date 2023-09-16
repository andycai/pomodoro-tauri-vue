<script setup lang="ts">
import { storeToRefs } from 'pinia';
import appStore from '../store';
import { Status, WorkType } from '../config';

console.log("render refresh")
const { reset } = appStore.main
const { status, workType } = storeToRefs(appStore.main)
const className = "cursor-pointer"
</script>

<template>
  <mdicon v-if="status === Status.Pause || workType === WorkType.Break" :class="className" name="refresh-circle" :width="24" :height="24" @click="reset" />
</template>