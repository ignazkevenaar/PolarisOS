<script setup>
import { useSettings } from "../../composables/settings.js";

const { settings } = useSettings();
</script>
<template>
  <pre>{{ settings }}</pre>
</template>

<style lang="css" scoped>
pre {
  margin: 0;
  background-color: darkblue;
  color: white;
  user-select: initial;
}
</style>
