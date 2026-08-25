<script setup>
import { ref, computed, watch } from "vue";
import { useProcessManager } from "../composables/processManager";
import { useWindowManager } from "../composables/windowManager";
import DockButton from "./dock/DockButton.vue";
import IconContainer from "./IconContainer.vue";

import dock from "../config/dock.js";

const { Process, processes, processOrder, startApplication, applicationIndex } =
  useProcessManager();
const { windows } = useWindowManager();

const pinnedDockItems = ref([]);
watch(
  applicationIndex,
  async () => {
    pinnedDockItems.value = [];
    for (const applicationID of dock) {
      const fetcher = applicationIndex.value[applicationID];
      if (!fetcher) continue;
      // I don't like having to fetch the manifest at all...
      const result = (await fetcher()).default;
      result.applicationID = applicationID; // TODO
      result.running = computed(() =>
        Object.values(processes.value).some(
          (process) => process.applicationID === applicationID,
        ),
      );
      pinnedDockItems.value.push(result);
    }
  },
  { immediate: true, deep: true },
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
    item.bringToFront();
  } else {
    item.show();
  }
};
</script>

<template>
  <div class="dockContainer">
    <DockButton
      v-for="application in pinnedDockItems"
      :key="application.applicationID"
      @click="startApplication(application.applicationID)"
    >
      <IconContainer :icon="application.icon"></IconContainer>
      <span class="notRunning text-shadow" v-if="!application.running"
        >...</span
      >
    </DockButton>
  </div>
  <div class="dockContainer">
    <DockButton
      v-for="(item, itemIndex) in dynamicDockItems"
      :key="itemIndex"
      @click="selectItem(item)"
    >
      <IconContainer :icon="item.icon ?? item.options?.icon"></IconContainer>
    </DockButton>
    <!-- {{ activeProcess }} -->
    {{ processOrder.at(-1) }}
  </div>
</template>

<style scoped>
.dockContainer {
  display: flex;
}

.notRunning {
  position: absolute;
  bottom: 0;
  inset-inline-start: 0;
}
</style>
