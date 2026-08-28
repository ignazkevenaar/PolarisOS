<script setup>
import { inject, ref } from "vue";
import applications from "../../config/applications.js";
import { useWindowManager } from "../../composables/windowManager.js";
import IconContainer from "../IconContainer.vue";

const { createOrSwitchToExistingWindow } = useWindowManager();

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
  createOrSwitchToExistingWindow(
    applicationID,
    application.component,
    application,
  );
};

const openBrowser = inject("openBrowser");
</script>
<template>
  <div
    class="color-container emboss grid"
    :class="{ active }"
    @click="selectedIndex = -1"
  >
    <template v-for="(item, index) in items" :key="index">
      <div
        class="iconContainer"
        :class="{ selected: index === selectedIndex }"
        @click.stop="selectedIndex = index"
        @dblclick="openBrowser(item.href) ?? openOrSwitchApplication(item)"
      >
        <div :class="getSelectedClasses(index, selectedIndex, active)">
          <IconContainer
            v-if="item.icon ?? applications[item].icon"
            :icon="item.icon ?? applications[item].icon"
          />
        </div>
        <div
          class="label"
          :class="getSelectedClasses(index, selectedIndex, active)"
        >
          <span>
            {{ item.name ?? applications[item].name }}
          </span>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="css" scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 100px);
  grid-auto-rows: minmax(120px, 150px);
  place-items: start center;
  place-self: stretch;
  gap: 8px;
  margin: 6px;
  padding: 8px;
  overflow: auto;
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
    user-select: none;
    text-align: center;

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
