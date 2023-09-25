<script setup lang="ts">
import { Status, WorkType } from '../config'
import Refresh from "../icons/refresh.vue"
import { useMainStore } from '../store/main';

const store = useMainStore()

</script>

<template>
  <button class="flex flex-row justify-end text-sm basis-1/4" title="Reset" v-if="store.status === Status.Pause || store.workType === WorkType.Break" @click="store.reset">
    <Refresh :width="16" :height="16" />
  </button>
</template>