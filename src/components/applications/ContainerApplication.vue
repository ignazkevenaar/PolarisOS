<script setup>
import { ref } from "vue";
import applications from "../../config/applications.js";
import ApplicationWindow from "../ApplicationWindow.vue";
import { useWindowManager } from "../../composables/windowManager.js";

const { registerOrSwitch } = useWindowManager();

defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});

const selectedIndex = ref(-1);

const getSelectedClasses = (index, selectedIndex, active) =>
  index === selectedIndex
    ? ["bevel", "color-tertiary", active ? "active" : ""]
    : [];

const openOrSwitchApplication = (applicationID) => {
  const application = applications[applicationID];
  registerOrSwitch(
    applicationID,
    application.name,
    application.component,
    application,
  );
};
</script>
<template>
  <ApplicationWindow>
    <template #default="{ active }">
      <div class="grid" @click="selectedIndex = -1">
        <div
          v-for="(item, index) in items"
          :key="index"
          class="iconContainer"
          :class="{ selected: index === selectedIndex }"
          @click.stop="selectedIndex = index"
          @dblclick="openOrSwitchApplication(item)"
        >
          <div :class="getSelectedClasses(index, selectedIndex, active)">
            <i
              v-if="applications[item].icon"
              class="icon-64"
              :class="applications[item].icon"
            ></i>
          </div>
          <div
            class="label"
            :class="getSelectedClasses(index, selectedIndex, active)"
          >
            <span>
              {{ applications[item].name }}
            </span>
          </div>
        </div>
      </div>
    </template>
  </ApplicationWindow>
</template>

<style lang="css" scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 100px);
  grid-auto-rows: 150px;
  place-items: start center;
  padding: 8px;
  gap: 8px;
  place-self: stretch;
}

.iconContainer {
  display: grid;
  grid-template-rows: 76px auto;
  place-items: center;

  .bevel,
  .label {
    padding: 4px;
  }

  .label {
    margin-top: 4px;
    text-align: center;
    user-select: none;

    &:not(.bevel) {
      padding-top: 6px; /* Border width */
    }

    span {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      overflow: hidden;
    }
  }

  &:active {
    filter: brightness(0.75);
  }
}
</style>
