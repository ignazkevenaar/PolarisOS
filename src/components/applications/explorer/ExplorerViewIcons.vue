<script setup>
import { ref, watch, toValue, computed } from "vue";
import ExplorerIcon from "./ExplorerIcon.vue";

const props = defineProps({
  chain: {
    type: Array,
    default: () => [],
  },
  selectedKey: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["activate"]);

// This view only shows the deepest open folder, not the selected item.
const depth = computed(() => props.chain.length - 1);
const folderItems = ref(undefined);

watch(
  () => props.chain.at(-1),
  async (folder) => {
    if (folder === undefined || folder.type !== "folder") {
      folderItems.value = undefined;
      return;
    }
    folderItems.value = toValue(await folder.contents);
  },
  { immediate: true },
);
</script>

<template>
  <div
    class="grid color-container emboss"
    @click.stop="emit('activate', depth)"
  >
    <ExplorerIcon
      v-for="(item, key) in folderItems"
      :key
      :fileOrFolder="item"
      :selected="selectedKey === key"
      :name="key"
      @click.prevent.stop="emit('activate', depth, key, item)"
      @dblclick.prevent="emit('activate', depth, key, item, true)"
    />
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 96px);
  grid-auto-rows: 128px;
  gap: 8px;
  padding: 16px;
  overflow: auto;
}
</style>
