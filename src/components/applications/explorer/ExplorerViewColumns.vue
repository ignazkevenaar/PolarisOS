<script setup>
import { ref, watch, nextTick } from "vue";
import ExplorerColumn from "./ExplorerColumn.vue";

const props = defineProps({
  chain: {
    type: Array,
    default: () => [],
  },
  openPath: {
    type: Array,
    default: () => [],
  },
  selectedKey: {
    type: String,
    default: null,
  },
  columnWidth: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["activate"]);

const columns = ref(undefined);

watch(
  () => props.chain,
  async () => {
    await nextTick();
    columns.value?.at(-1)?.$el?.scrollIntoView();
  },
);
</script>

<template>
  <div class="columns">
    <ExplorerColumn
      v-for="(folder, depth) in chain"
      :key="depth"
      ref="columns"
      :folder="folder"
      :activeKey="depth < openPath.length ? openPath[depth] : selectedKey"
      :style="{ width: `${columnWidth}px`, flexBasis: `${columnWidth}px` }"
      @activate="(key, item, open) => emit('activate', depth, key, item, open)"
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
    flex: 0;
  }
}
</style>
