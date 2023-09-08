<script setup lang="ts">
import appStore from '../store';

console.log("render refresh")
const { reset } = appStore.main
const className = "cursor-pointer"
</script>

<template>
  <mdicon :class="className" name="refresh-circle" :width="24" :height="24" @click="reset" />
</template>