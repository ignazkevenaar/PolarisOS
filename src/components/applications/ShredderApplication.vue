<script setup>
import { useSettings } from "../../composables/settings.js";
import DialogWindow from "../DialogWindow.vue";
import IconButton from "../IconButton.vue";

defineProps({
  text: {
    type: String,
    default: "",
  },
});

const { resetSettings } = useSettings();

const resetAndReload = (close) => {
  resetSettings();
  close();
  location.reload();
};
</script>
<template>
  <DialogWindow
    text="Are you sure you want to reset your settings and restart?"
  >
    <template #buttons="{ close }">
      <IconButton text="Reset and Restart" @click="resetAndReload(close)" />
      <IconButton text="Cancel" @click="close()" />
    </template>
  </DialogWindow>
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
