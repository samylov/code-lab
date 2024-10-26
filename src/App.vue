<template>
  <div id="app">
    <StarryBackground />
    <div class="content">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import StarryBackground from './components/StarryBackground.vue'
</script>

<style>
#app {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
}

.content {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
}
</style>
