<template>
  <div class="flex flex-col min-h-screen bg-[#052e16]">
    <AppBar />
    <main class="flex-grow">
      <router-view />
    </main>

  </div>
</template>

<script setup>
import AppBar from '@/components/AppBar.vue'

</script>