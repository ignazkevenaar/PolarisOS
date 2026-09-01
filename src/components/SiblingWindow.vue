<script setup>
import { ref, computed, watch, inject } from "vue";
import { useWindowManager } from "../composables/windowManager";
import ApplicationWindow from "./ApplicationWindow.vue";

const model = defineModel({ type: Boolean });

const props = defineProps({
  processID: {
    type: String,
    required: true,
  },
});

const {
  registerWindow,
  windowOrder,
  minimizedWindowIDs,
  hiddenWindows,
  windows,
  focusedWindowID,
} = useWindowManager();

const desktopElement = inject("desktopElement");

const currentWindowID = ref(undefined);
const window = computed(() => windows.value[currentWindowID.value]);

watch(model, (newModel) => {
  if (newModel) {
    const { windowID } = registerWindow(props.processID, {});
    currentWindowID.value = windowID;
  } else {
    window.value.close();
  }
});
</script>

<template>
  <Teleport :to="desktopElement">
    <ApplicationWindow
      v-if="window && model"
      :window="window"
      :title="window.title"
      :x="window.x"
      :y="window.y"
      :width="window.width"
      :height="window.height"
      :hidden="
        minimizedWindowIDs.has(currentWindowID) ||
        hiddenWindows.has(currentWindowID)
      "
      :active="focusedWindowID === currentWindowID"
      :z-index="windowOrder.indexOf(currentWindowID) + 1"
      :passed-props="window.passedProps"
      v-bind="window.options"
      @focus="window.bringToFront()"
      @drag-move="window.move($event.x, $event.y)"
      @drag-end="window.move($event.x, $event.y)"
      @resize="window.resize($event.width, $event.height)"
      @close="model = false"
      @minimize="window.minimize()"
      v-slot="{ repaint, ...props }"
    >
      <slot v-bind="props" @vue:mounted="repaint()"></slot>
    </ApplicationWindow>
  </Teleport>
</template>
