<script setup lang="ts">
import OperationButton from './OperactionButton.vue'
import RefreshButton from './RefreshButton.vue'
import Palette from '../icons/palette.vue'

</script>

<template>
  <div class="flex flex-row items-end mt-2 px-1">
    <button class="flex flex-row justify-start text-sm basis-1/4" title="Change Theme" @click="$emit('changeTheme')">
        <Palette />
    </button>
    <OperationButton />
    <RefreshButton />
  </div> 
</template>