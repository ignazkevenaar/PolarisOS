<script setup>
import { ref, watch, nextTick } from "vue";
import ExplorerColumn from "./ExplorerColumn.vue";

const props = defineProps({
  folders: {
    type: Array,
    default: () => [],
  },
  selections: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["open", "select"]);

const columns = ref(undefined);

watch(
  () => props.folders,
  async () => {
    await nextTick();
    const lastColumn = columns.value?.at(-1).$el;
    lastColumn?.scrollIntoView();
  },
);
</script>

<template>
  <div class="columns">
    <ExplorerColumn
      v-for="(folder, folderIndex) in folders"
      :key="folderIndex"
      ref="columns"
      :folder="folder"
      :model-value="selections[folderIndex]"
      @update:model-value="emit('select', folderIndex, $event)"
      @open="emit('open', folderIndex, $event)"
    />
  </div>
</template>

<style scoped>
.columns {
  display: flex;
  justify-content: flex-start;
  max-width: 100%;
  height: 100%;
  overflow-x: auto;

  > * {
    flex: 0 0 200px;
    width: 200px;
  }
}
</style>
