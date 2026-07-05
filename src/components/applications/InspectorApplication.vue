<script setup>
import ApplicationWindow from "../ApplicationWindow.vue";
import { useSettings } from "../../composables/settings.js";

const { settings } = useSettings();
</script>
<template>
  <ApplicationWindow>
    <pre>{{ settings }}</pre>
  </ApplicationWindow>
</template>

<style lang="css" scoped>
pre {
  background-color: darkblue;
  color: white;
  margin: 0;
  user-select: initial;
}
</style>
