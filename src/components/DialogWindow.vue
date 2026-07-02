<script setup>
import ApplicationWindow from "./ApplicationWindow.vue";

defineProps({
  text: {
    type: String,
    default: "",
  },
});
</script>
<template>
  <ApplicationWindow>
    <template #default="{ close }">
      <div class="container">
        <div class="content">
          <i class="icon-64 warning" />
          <p>{{ text }}</p>
        </div>
        <div class="toolbar">
          <slot name="buttons" :close="close" />
        </div>
      </div>
    </template>
  </ApplicationWindow>
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
