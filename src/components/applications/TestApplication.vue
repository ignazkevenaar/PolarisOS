<script setup>
import { ref } from "vue";

const counter = ref(0);
</script>
<template>
  <div>
    {{ counter }}<br />
    <button @click="counter++">increment</button>
    <button @click="counter--">decrement</button>
  </div>
</template>
