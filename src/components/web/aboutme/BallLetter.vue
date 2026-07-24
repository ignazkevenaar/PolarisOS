<script setup>
import { ref } from "vue";

const letters = "NFSⅢ";
let index = 0;
const letter = ref(letters[index]);

setInterval(() => {
  index = (index + 1) % letters.length;
  letter.value = letters[index];
}, 5000);
</script>

<template>
  <Transition mode="out-in">
    <span class="letter" :key="letter">{{ letter }}</span>
  </Transition>
</template>

<style>
.letter {
  mix-blend-mode: overlay;
  font-style: italic;
  width: 100%;
  color: white;
  text-shadow: 0 0 10px black;
  border-radius: 100%;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 1s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
