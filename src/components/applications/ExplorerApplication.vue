<script setup>
import { ref, computed, watch, toValue } from "vue";
import { useFilesystem } from "../../composables/filesystem.js";
import ExplorerIcon from "./explorer/ExplorerIcon.vue";
import MosaicArrow from "../mosaic/MosaicArrow.vue";
import ExplorerViewColumns from "./explorer/ExplorerViewColumns.vue";
import ExplorerViewIcons from "./explorer/ExplorerViewIcons.vue";
import IconButton from "../IconButton.vue";

const { getFile } = useFilesystem();

const viewMode = ref("columns");
// Used for column view columns and icon breadcrumbs to make them align.
const columnWidth = 150;

const openPath = ref([]);
const selectedKey = ref(null);
const resolvedChain = ref([]);
// Might want to replace these with a "loading"-state with some [reasons] to just block additional input.
// Variable that counts up to check whether or not the promise
// result actually relates to the latest call to `getFile`.
let resolveGeneration = 0;

watch(
  openPath,
  async (path) => {
    const generation = ++resolveGeneration;
    const chain = await getFile(path, true);
    if (generation !== resolveGeneration) return; // Superseded by a later navigation, results are outdated.
    resolvedChain.value = chain ?? [];
  },
  { immediate: true },
);

const selectedItem = ref(null);
// Variable that counts up to check whether or not the promise
// result actually relates to the latest call to `getFile`.
let selectionGeneration = 0;
watch(
  [resolvedChain, selectedKey],
  async ([chain, key]) => {
    const generation = ++selectionGeneration;
    if (!key) {
      selectedItem.value = null;
      return;
    }
    const contents = toValue(await chain.at(-1)?.contents);
    if (generation !== selectionGeneration) return;
    selectedItem.value = contents?.[key] ?? null;
  },
  { immediate: true },
);

const breadcrumbItems = computed(() => [
  ...resolvedChain.value,
  // NeXTSTEP shows any selected file as an icon.
  ...(selectedItem.value ? [selectedItem.value] : []),
]);

const activate = (depth, key, item, open) => {
  openPath.value = openPath.value.slice(0, depth);

  if (key === undefined) {
    selectedKey.value = null;
    return;
  }

  if (open) {
    if (item?.type === "folder") {
      openPath.value = [...openPath.value, key];
      selectedKey.value = null;
    } else {
      console.log("Opening file!", key);
      selectedKey.value = key;
    }
  } else {
    selectedKey.value = key;
  }
};

const goUp = () => activate(Math.max(openPath.value.length - 1, 0));
</script>
<template>
  <div class="container">
    <div class="toolbar">
      <IconButton @click="goUp">.. Up</IconButton>
      <IconButton @click="viewMode = 'columns'">Column view</IconButton>
      <IconButton @click="viewMode = 'icons'">Icons view</IconButton>
    </div>
    <div class="iconCrumbs">
      <div
        v-for="(fileOrFolder, index) in breadcrumbItems"
        :key="index"
        :style="{ flexBasis: `${columnWidth}px` }"
      >
        <ExplorerIcon
          :fileOrFolder
          @click="fileOrFolder !== selectedItem ? activate(index) : undefined"
          @dblclick="
            fileOrFolder === selectedItem
              ? activate(index, selectedKey, selectedItem, true)
              : undefined
          "
          :name="fileOrFolder.name ?? openPath[index - 1] ?? selectedKey"
          :selected="index === breadcrumbItems.length - 1"
        />
        <MosaicArrow v-if="index < breadcrumbItems.length - 1" />
      </div>
    </div>

    <div class="views">
      <Component
        :is="viewMode === 'columns' ? ExplorerViewColumns : ExplorerViewIcons"
        :chain="resolvedChain"
        :openPath="openPath"
        :selectedKey="selectedKey"
        :column-width="viewMode === 'columns' ? columnWidth : undefined"
        @activate="activate"
      />
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow: hidden;

  hr {
    width: 100%;
  }

  .columns {
    flex: 1 1 auto;
  }
}

.iconCrumbs {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 8px;
  padding-block: 8px;
  overflow: auto;

  > div {
    position: relative;
  }

  :deep(.triangle) {
    position: absolute;
    top: 50%;
    right: 0;
    translate: 50% -50%;
  }
}

.views {
  position: relative;
  flex: 1;
  min-height: 0;

  > * {
    box-sizing: border-box;
    height: 100%;
  }
}

.toolbar {
  display: flex;
  justify-content: flex-start;
}
</style>
