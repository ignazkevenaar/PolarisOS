<script setup>
import { inject } from "vue";
import { useWindowManager } from "../composables/windowManager";
import ApplicationWindow from "./ApplicationWindow.vue";

defineProps({
  window: {
    type: String,
    required: true,
  },
});

const { windowOrder, minimizedWindowIDs } = useWindowManager();
const desktopElement = inject("desktopElement");
</script>

<template>
  <Teleport :to="desktopElement">
    <ApplicationWindow
      v-if="window"
      v-show="!minimizedWindowIDs.has(window.windowID)"
      :window-i-d="window.windowID"
      v-bind="window.options"
      :active="
        windowOrder.at(-1) === window.windowID &&
        !minimizedWindowIDs.has(window.windowID)
      "
      :z-index="windowOrder.indexOf(window.windowID) + 1"
      @focus="window.bringToFront()"
      @drag-move="window.move($event.x, $event.y)"
      @drag-end="window.move($event.x, $event.y)"
      @resize="window.resize($event.width, $event.height)"
      @close="window.close()"
      @minimize="window.minimize()"
    >
      <slot></slot>
    </ApplicationWindow>
  </Teleport>
</template>
