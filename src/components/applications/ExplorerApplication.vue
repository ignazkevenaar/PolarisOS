<script setup>
import { onMounted, ref, watch } from "vue";
import ApplicationWindow from "../ApplicationWindow.vue";
import { useFilesystem } from "../../composables/filesystem.js";
import ExplorerIcon from "./explorer/ExplorerIcon.vue";
import MosaicArrow from "../mosaic/MosaicArrow.vue";
import ExplorerViewColumns from "./explorer/ExplorerViewColumns.vue";
import ExplorerViewIcons from "./explorer/ExplorerViewIcons.vue";

const { splitPathToParts, getFolderUp, getFile, pathSeparator } =
  useFilesystem();

const path = ref("");
const activeFolders = ref([]);
const selections = ref([]);

watch(
  path,
  (newPath) => {
    const parts = newPath.split(pathSeparator);
    selections.value = parts;
  },
  { immediate: true },
);

const goToFolder = async (newPath, force) => {
  if (!force && path.value === newPath) return;

  path.value = newPath;
  const fileOrFolder = await getFile(path.value, true);

  // Filter last selected file from crumbs.
  // NeXTStep shows any selected file as an icon.
  // if (fileOrFolder.at(-1).type === "file") {
  //   fileOrFolder.splice(fileOrFolder.length - 1, 1);
  // }
  activeFolders.value = fileOrFolder;
};

const modifyPath = (index, pathPart) => {
  const split = splitPathToParts(path.value);
  split.splice(index + 1);
  if (pathPart.length) split.push(pathPart);
  return split.join(pathSeparator);
};

const select = async (index, pathPart) => {
  console.log("selecting", pathPart, index);
  selections.value[index] = pathPart;
  goToFolder(modifyPath(index - 1, pathPart));
};

const open = async (index, pathPart) => {
  const joined = modifyPath(index, pathPart);
  const fileOrFolders = await getFile(joined, true);
  console.log("Trying to open a file:", fileOrFolders.at(-1));
};

onMounted(() => {
  goToFolder(path.value, true);
});
</script>
<template>
  <ApplicationWindow title="Binbows Exploder">
    <div class="container">
      <div v-if="false">
        <button @click="goToFolder(getFolderUp(path))">.. up</button>
      </div>
      <div class="iconCrumbs">
        <template v-for="(fileOrFolder, index) in activeFolders" :key="index">
          <ExplorerIcon
            :fileOrFolder
            @click="select(index, '')"
            :name="selections[index - 1]"
            :selected="index == activeFolders.length - 1"
          />
          <MosaicArrow v-if="index < activeFolders.length - 1" />
        </template>
      </div>

      <div class="views">
        <ExplorerViewIcons
          v-if="false"
          :folders="activeFolders"
          :selections
          @select="select"
          @open="open"
        />

        <ExplorerViewColumns
          v-if="true"
          :folders="activeFolders"
          :selections
          @select="select"
          @open="open"
        />
      </div>
      <!-- {{ activeFolders.length }} -->
    </div>
  </ApplicationWindow>
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
  align-items: center;
  gap: 8px;
  padding: 8px;
  overflow: auto;

  .iconContainer {
    width: 100px;
  }
}

.views {
  position: relative;
  flex: 1;

  > * {
    height: 100%;
  }
}
</style>
