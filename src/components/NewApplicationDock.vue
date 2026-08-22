<script setup>
import { computed } from "vue";
import { useProcessManager } from "../composables/processManager";
import { useWindowManager } from "../composables/windowManager";
import DockButton from "./dock/DockButton.vue";
import IconContainer from "./IconContainer.vue";

import applications from "../config/applications.js";
import dock from "../config/dock.js";

const { processes, bringProcessToFront, processOrder } = useProcessManager();
const { windows, createOrSwitchToExistingWindow } = useWindowManager();

const orderedProcessessAndWindows = computed(() => {
  const result = [];

  // Processes
  Object.entries(processes.value).map(([processID, process]) => {
    result.push({ ...process, processID, thisIsAProcess: true });
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
  if (item.thisIsAProcess) {
    // Application
    bringProcessToFront(item.processID);
  } else {
    item.show();
  }
};

const startApplication = (applicationID) => {
  // Legacy function just to get some legacy applications up and running before everything is moved to manifests.
  const application = applications[applicationID];
  if (!application) {
    console.error(applicationID, "is not an application.");
    return;
  }

  createOrSwitchToExistingWindow(
    applicationID,
    application.component,
    application,
  );
};
</script>

<template>
  <div class="dockContainer">
    <DockButton
      v-for="applicationID in dock"
      :key="applicationID"
      @click="startApplication(applicationID)"
    >
      <IconContainer :icon="applications[applicationID].icon"></IconContainer>
    </DockButton>
  </div>
  <div class="dockContainer">
    <DockButton
      v-for="(item, itemIndex) in orderedProcessessAndWindows"
      :key="itemIndex"
      @click="selectItem(item)"
    >
      <IconContainer :icon="item.icon ?? item.options?.icon"></IconContainer>
    </DockButton>
    <!-- {{ activeProcess }} -->
    <!-- {{ processOrder.at(-1) }} -->
  </div>
</template>

<style scoped>
.dockContainer {
  display: flex;
}
</style>
