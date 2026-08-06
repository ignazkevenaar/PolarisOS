<script setup lang="ts">
import IconContainer from "../../IconContainer.vue";
import { useFilesystem } from "../../../composables/filesystem.js";

defineProps({
  fileOrFolder: {
    type: Object,
  },
  name: {
    type: String,
  },
  selected: {
    type: Boolean,
  },
});

const { iconMap } = useFilesystem();
</script>

<template>
  <div class="iconContainer">
    <div
      class="selectable icon"
      :class="selected ? 'apply-color color-tertiary active' : ''"
    >
      <IconContainer :icon="fileOrFolder.icon ?? iconMap[fileOrFolder.type]" />
    </div>
    <label
      class="selectable"
      :class="selected ? 'apply-color color-tertiary active' : ''"
      >{{
        name || fileOrFolder.name || fileOrFolder.part || fileOrFolder.type
      }}</label
    >
  </div>
</template>

<style scoped>
.iconContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* gap: 4px; */

  .selectable {
    padding: 2px 6px;

    &.icon {
      border-radius: 8px;
      padding: 6px 12px;
    }
  }

  label {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &.selectable {
      padding-inline: 8px;
    }
  }
}
</style>
