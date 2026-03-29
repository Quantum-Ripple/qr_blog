<template>
  <div id="app" class="min-h-screen bg-white flex flex-col">
    <AppBar v-if="showAppBar" />

    <main class="flex-grow">
      <router-view>
      </router-view>
    </main>

 
    
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppBar from './components/AppBar.vue'

const route = useRoute()

const showAppBar = computed(() => !route.meta.requiresGuest)
</script>

<style>
/* Ensure the dark theme covers the entire browser window */
html, body {
  background-color: #ecefef;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

/* Smooth page transition when switching routes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
