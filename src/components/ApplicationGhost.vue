<script setup>
import { inject } from "vue";
import { useWindowManager } from "../composables/windowManager";
import ApplicationWindow from "./ApplicationWindow.vue";

defineProps({
  windowID: {
    type: String,
    required: true,
  },
});

const desktopElement = inject("desktopElement");

const {
  windows,
  windowOrder,
  minimizedWindows,
  bringToFront,
  move,
  resize,
  close,
  minimize,
} = useWindowManager();
</script>

<template>
  <Teleport :to="desktopElement">
    <ApplicationWindow
      v-if="windowID"
      v-show="!minimizedWindows.has(windowID)"
      :window-i-d="windowID"
      v-bind="windows[windowID]"
      :active="
        windowOrder.at(-1) === windowID && !minimizedWindows.has(windowID)
      "
      :z-index="windowOrder.indexOf(windowID) + 1"
      @focus="bringToFront(windowID)"
      @drag-move="move(windowID, $event)"
      @drag-end="move(windowID, $event)"
      @resize="resize(windowID, $event)"
      @close="close(windowID)"
      @minimize="minimize(windowID)"
    >
      <slot></slot>
    </ApplicationWindow>
  </Teleport>
</template>
