<script setup lang="ts">
import { storeToRefs } from 'pinia'
import appStore from '../store'
import { Status, WorkType } from '../config'
import Refresh from "../icons/refresh.vue"

const { reset } = appStore.main
const { status, workType } = storeToRefs(appStore.main)
</script>

<template>
  <button class="flex flex-row justify-end text-sm basis-1/4" title="Reset" v-if="status === Status.Pause || workType === WorkType.Break" @click="reset">
    <Refresh :width="16" :height="16" />
  </button>
</template>