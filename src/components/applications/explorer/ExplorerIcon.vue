<script setup lang="ts">
import IconContainer from "../../IconContainer.vue";
import { useFilesystem } from "../../../composables/filesystem.js";
import { computed, inject } from "vue";

const props = defineProps({
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
const active = inject("windowActive");

const selectedClasses = computed(() => ({
  "apply-color color-tertiary": props.selected,
  active: active.value && props.selected,
}));
</script>

<template>
  <div class="iconContainer">
    <div class="selectable icon" :class="selectedClasses">
      <IconContainer :icon="fileOrFolder.icon ?? iconMap[fileOrFolder.type]" />
    </div>
    <label class="selectable" :class="selectedClasses">{{
      name || fileOrFolder.name || fileOrFolder.part || fileOrFolder.type
    }}</label>
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
