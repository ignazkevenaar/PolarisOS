<script setup>
import { ref, computed, watch } from "vue";
import { useProcessManager } from "../composables/processManager";
import { useWindowManager } from "../composables/windowManager";
import DockButton from "./dock/DockButton.vue";
import IconContainer from "./IconContainer.vue";

import dock from "../config/dock.js";

const { Process, processes, startApplication, applicationIndex } =
  useProcessManager();
const { windows } = useWindowManager();

const pinnedDockItems = ref([]);
watch(
  applicationIndex,
  async () => {
    pinnedDockItems.value = [];
    for (const applicationID of dock) {
      const manifest = applicationIndex.value[applicationID];
      if (!manifest) continue;
      manifest.running = computed(() =>
        Object.values(processes.value).some(
          (process) => process.applicationID === applicationID,
        ),
      );
      pinnedDockItems.value.push(manifest);
    }
  },
  { immediate: true },
);

const dynamicDockItems = computed(() => {
  const result = [];

  // Processes
  Object.entries(processes.value).map(([, process]) => {
    // TODO: Naive
    if (dock.indexOf(process.applicationID) === -1) {
      result.push(process);
    }
  });

  // Windows
  Object.entries(windows.value).map(([, window]) => {
    if (window.minimizedAt > 0) result.push(window);
  });

  result.sort((a, b) => {
    if ((a.minimizedAt ?? a.createdAt) > (b.minimizedAt ?? b.createdAt)) {
      return 1;
    }
    if ((a.minimizedAt ?? a.createdAt) < (b.minimizedAt ?? b.createdAt)) {
      return -1;
    }
    return 0;
  });

  return result;
});

const selectItem = (item) => {
  if (item instanceof Process) {
    item.bringWindowsToFront();
  } else {
    item.show();
  }
};
</script>

<template>
  <div class="container">
    <div class="dockContainer pinned">
      <DockButton
        v-for="application in pinnedDockItems"
        :key="application.applicationID"
        @click="startApplication(application.applicationID)"
      >
        <IconContainer :icon="application.icon"></IconContainer>
        <!-- Move into DockButton -->
        <span class="notRunning text-shadow" v-if="!application.running"
          >...</span
        >
      </DockButton>
    </div>
    <div class="dockContainer">
      <DockButton
        v-for="(item, itemIndex) in dynamicDockItems"
        :key="itemIndex"
        :title="item.options?.title"
        @click="selectItem(item)"
      >
        <IconContainer :icon="item.icon ?? item.options?.icon"></IconContainer>
      </DockButton>
      <div>
        <!-- <pre>{{ windowOrder }}</pre> -->
        <!-- <pre>{{ activeProcessID }}</pre> -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: grid;
  grid-template-rows: 1fr auto;
  grid-template-columns: 1fr auto;
  width: 100%;
  height: 100%;
}

.dockContainer {
  display: flex;
  grid-row-start: 2;

  &.pinned {
    grid-row-start: 1;
    grid-column-start: 2;
    flex-direction: column;
  }
}

.notRunning {
  position: absolute;
  bottom: 0;
  inset-inline-start: 2px;
}
</style>
