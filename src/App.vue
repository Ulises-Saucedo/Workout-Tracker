<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import Navigation from './components/Navigation.vue'
</script>

<template>
  <Toaster theme="dark" position="top-right" richColors />
  <Navigation />

  <RouterView />
</template>
