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
  focusOrder,
  hiddenWindows,
  bringToFront,
  move,
  resize,
  close,
  hide,
  show,
  registerOrSwitch,
} = useWindowManager();
</script>

<template>
  <Teleport :to="desktopElement">
    <ApplicationWindow
      v-if="windowID"
      v-show="!hiddenWindows.has(windowID)"
      :window-i-d="windowID"
      v-bind="windows[windowID]"
      :active="focusOrder.at(-1) === windowID && !hiddenWindows.has(windowID)"
      :z-index="focusOrder.indexOf(windowID) + 1"
      @focus="bringToFront(windowID)"
      @drag-move="move(windowID, $event)"
      @drag-end="move(windowID, $event)"
      @resize="resize(windowID, $event)"
      @close="close(windowID)"
      @minimize="hide(windowID)"
    >
      {{ windowOrder }}
      <slot></slot>
    </ApplicationWindow>
  </Teleport>
</template>
