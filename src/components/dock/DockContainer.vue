<script setup>
import { useWindowManager } from "../../composables/windowManager.js";
import applications from "../../config/applications.js";
import IconContainer from "../IconContainer.vue";
import DockButton from "./DockButton.vue";

const { registerOrSwitch, processIDsWithOpenWindows } = useWindowManager();

const openOrSwitchApplication = (applicationID) => {
  const application = applications[applicationID];

  if (application) {
    registerOrSwitch(
      applicationID,
      application.name,
      application.component,
      application,
    );
  }
};

defineProps({
  items: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div class="container emboss">
    <DockButton
      v-for="(applicationID, applicationIndex) in items"
      :key="applicationIndex"
      :open="processIDsWithOpenWindows.has(applicationID)"
      :tooltip="applications[applicationID]?.name"
      @click="openOrSwitchApplication(applicationID)"
    >
      <IconContainer
        :icon="applications[applicationID]?.icon || 'application'"
      />
    </DockButton>
  </div>
</template>

<style lang="css" scoped>
.container {
  display: flex;
  box-sizing: border-box;
  width: auto;
}
</style>
