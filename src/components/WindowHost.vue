<script setup>
import { useWindowManager } from "../composables/windowManager.js";
import ApplicationWindow from "./ApplicationWindow.vue";

const {
  windows,
  windowOrder,
  hiddenWindows,
  minimizedWindowIDs,
  focusedWindowID,
} = useWindowManager();
</script>

<template>
  <template v-for="(window, windowID) in windows" :key="windowID">
    <ApplicationWindow
      v-if="window.component"
      :window="window"
      :title="window.title"
      :x="window.x"
      :y="window.y"
      :width="window.width"
      :height="window.height"
      :hidden="minimizedWindowIDs.has(windowID) || hiddenWindows.has(windowID)"
      :active="focusedWindowID === windowID"
      :z-index="windowOrder.indexOf(windowID) + 1"
      :passed-props="window.passedProps"
      v-bind="window.options"
      @focus="window.bringToFront()"
      @drag-move="window.move($event.x, $event.y)"
      @drag-end="window.move($event.x, $event.y)"
      @resize="window.resize($event.width, $event.height)"
      @close="window.close()"
      @minimize="window.minimize()"
      v-slot="{ childMounted, ...props }"
    >
      <Component
        :is="window.component"
        v-bind="props"
        @vue:mounted="childMounted()"
      ></Component>
    </ApplicationWindow>
  </template>
</template>
