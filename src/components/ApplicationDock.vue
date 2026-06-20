<script setup>
import DockButton from "./DockButton.vue";
import { useWindowManager } from "../composables/windowManager.js";
import dock from "../config/dock.js";
import { computed } from "vue";
import applications from "../config/applications.js";

const { windows, registerOrSwitch, openWindowIDs } = useWindowManager();

const openOrSwitchApplication = (applicationID) => {
  const application = applications[applicationID];
  registerOrSwitch(
    applicationID,
    application.name,
    application.component,
    application,
  );
};

const openWindowsNotAlreadyInDock = computed(() => {
  return Object.values(windows.value)
    .filter((window) => {
      const dockHasApplication = !!dock.find((dockApplicationID) => {
        return dockApplicationID === window.id;
      });
      return !dockHasApplication;
    })
    .map((window) => window.id);
});
</script>

<template>
  <div class="dockContainer">
    <div class="dock bevel color-primary">
      <div class="bevel flex">
        <div class="container emboss">
          <DockButton
            v-for="(applicationID, applicationIndex) in dock"
            :key="applicationIndex"
            :open="openWindowIDs.has(applicationID)"
            :tooltip="applications[applicationID].name"
            @click="openOrSwitchApplication(applicationID)"
          >
            <i class="icon-64" :class="applications[applicationID].icon"></i>
          </DockButton>
        </div>
        <div v-if="openWindowsNotAlreadyInDock.length" class="container emboss">
          <DockButton
            v-for="(
              applicationID, applicationIndex
            ) in openWindowsNotAlreadyInDock"
            :key="applicationIndex"
            :tooltip="applications[applicationID].name"
            @click="openOrSwitchApplication(applicationID)"
          >
            <i class="icon-64" :class="applications[applicationID].icon"></i>
          </DockButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.dockContainer {
  width: 100%;
  display: flex;
  justify-content: center;
}

.dock {
  z-index: 10;
  padding: 2px;

  > div {
    padding: 2px;
    padding-bottom: 4px;
    padding-inline: 24px;
    margin-bottom: -8px;
  }
}

.container {
  width: auto;
  display: flex;
  box-sizing: border-box;
}

.flex {
  display: flex;
  gap: 4px;
}
</style>
