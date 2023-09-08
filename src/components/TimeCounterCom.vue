<script setup lang="ts">
import appStore from '../store';
import { storeToRefs } from 'pinia';

const { timeShow } = storeToRefs(appStore.main)
console.log("render TimeCounter", timeShow.value);
const className = "antialiased text-8xl font-black text-center ";

</script>

<template>
    <h1 :class="className">{{ timeShow }}</h1>
</template>