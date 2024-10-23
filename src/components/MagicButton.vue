<template>
  <button
    class="magic-button mx-4 bg-slate-800 font-bold text-zinc-300 p-2 rounded w-20"
    :style="colorVariables"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
const colorVariables = {
  '--orange': '#FF6D1B',
  '--yellow': '#FFEE55',
  '--green': '#5BFF89',
  '--blue': '#4D8AFF',
  '--purple': '#6B5FFF',
  '--pink': '#FF64F9',
  '--red': '#FF6565',
  '--m': '4rem',
}
</script>

<style scoped>
.magic-button {
  border: calc(0.04 * var(--m)) solid transparent;
  position: relative;
  border-radius: calc(0.3 * var(--m));
  display: flex;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;
  background: linear-gradient(#282d33, #1a1d21),
    linear-gradient(#282d33 50%, rgba(18, 18, 19, 0.6) 80%, rgba(18, 18, 19, 0)),
    linear-gradient(
      90deg,
      var(--orange),
      var(--yellow),
      var(--green),
      var(--blue),
      var(--purple),
      var(--pink),
      var(--red)
    );
  background-origin: border-box;
  background-clip: padding-box, border-box, border-box;
  background-size: 200%;
  animation: animate 2s infinite linear;
}

.magic-button:active {
  transform: translateY(5px);
}

.magic-button::before {
  content: '';
  background: linear-gradient(
    90deg,
    var(--orange),
    var(--yellow),
    var(--green),
    var(--blue),
    var(--purple),
    var(--pink),
    var(--red)
  );
  height: 30%;
  width: 60%;
  position: absolute;
  bottom: -20%;
  z-index: -5;
  background-size: 200%;
  animation: animate 2s infinite linear;
  filter: blur(calc(0.8 * var(--m)));
}

.magic-button:hover,
.magic-button:hover::before {
  animation: animate 0.5s infinite linear;
}

@keyframes animate {
  0% {
    background-position: 0;
  }
  100% {
    background-position: 200%;
  }
}
</style>
