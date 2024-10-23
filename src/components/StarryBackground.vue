<template>
  <div class="starry-background">
    <div id="stars" :style="{ boxShadow: starsBoxShadow }"></div>
    <div id="stars2" :style="{ boxShadow: stars2BoxShadow }"></div>
    <div id="stars3" :style="{ boxShadow: stars3BoxShadow }"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const starsBoxShadow = ref<string>('')
const stars2BoxShadow = ref<string>('')
const stars3BoxShadow = ref<string>('')

function generateBoxShadow(n: number, color: string): string {
  const shadows: string[] = []
  for (let i = 0; i < n; i++) {
    const x = Math.floor(Math.random() * 2000)
    const y = Math.floor(Math.random() * 2000)
    shadows.push(`${x}px ${y}px ${color}`)
  }
  return shadows.join(', ')
}

onMounted(() => {
  starsBoxShadow.value = generateBoxShadow(700, '#FFF')
  stars2BoxShadow.value = generateBoxShadow(200, '#FFF')
  stars3BoxShadow.value = generateBoxShadow(100, '#FFF')
})
</script>

<style scoped>
.starry-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1; /* Чтобы фон был за контентом */
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
  overflow: hidden;
}

#stars,
#stars2,
#stars3 {
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 1px;
  background: transparent;
}

#stars {
  animation: animStar 150s linear infinite; /* Длительность увеличена в 3 раза */
}

#stars:after {
  content: ' ';
  position: absolute;
  top: 2000px;
  width: 1px;
  height: 1px;
  background: transparent;
  box-shadow: inherit;
}

#stars2 {
  width: 2px;
  height: 2px;
  animation: animStar 300s linear infinite; /* Длительность увеличена в 3 раза */
}

#stars2:after {
  content: ' ';
  position: absolute;
  top: 2000px;
  width: 2px;
  height: 2px;
  background: transparent;
  box-shadow: inherit;
}

#stars3 {
  width: 3px;
  height: 3px;
  animation: animStar 450s linear infinite; /* Длительность увеличена в 3 раза */
}

#stars3:after {
  content: ' ';
  position: absolute;
  top: 2000px;
  width: 3px;
  height: 3px;
  background: transparent;
  box-shadow: inherit;
}

@keyframes animStar {
  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(-2000px);
  }
}
</style>
