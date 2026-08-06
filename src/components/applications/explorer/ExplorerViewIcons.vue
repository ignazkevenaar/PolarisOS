<script setup>
import { ref, watch, toValue, computed } from "vue";
import ExplorerIcon from "./ExplorerIcon.vue";

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

const folder = computed(() =>
  props.folders?.filter((item) => item.type === "folder").at(-1),
);
const lastFolderIndex = computed(() => props.folders.length - 1);

const folderItems = ref(undefined);
const localSelection = ref(undefined);
const select = (key) => (localSelection.value = key);

watch(
  folder,
  async (newFolder) => {
    if (newFolder === undefined) return;
    const folderContents = toValue(await newFolder.contents);
    folderItems.value = folderContents;
  },
  { immediate: true },
);
</script>

<template>
  <div
    class="grid color-container emboss"
    @click.stop="localSelection = undefined"
  >
    <ExplorerIcon
      v-for="(item, key) in folderItems"
      :key
      :fileOrFolder="item"
      :selected="localSelection === key"
      :name="key"
      @click.prevent.stop="select(key)"
      @dblclick.prevent="
        emit(item.type === 'folder' ? 'select' : 'open', lastFolderIndex, key)
      "
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
}
</style>
