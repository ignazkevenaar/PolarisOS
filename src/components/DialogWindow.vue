<script setup>
import LargeIcon from "./LargeIcon.vue";

defineProps({
  text: {
    type: String,
    default: "",
  },
  close: {
    type: Function,
  },
});
</script>
<template>
  <div class="container">
    <div class="content">
      <LargeIcon icon="warning" />
      <p>{{ text }}</p>
    </div>
    <div class="toolbar">
      <slot name="buttons" :close="close" />
    </div>
  </div>
</template>

<style lang="css" scoped>
.container {
  padding: 8px;
}

.content {
  display: flex;
  align-items: start;
  gap: 8px;

  p {
    flex: 1;
  }
}

.toolbar {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
}
</style>
