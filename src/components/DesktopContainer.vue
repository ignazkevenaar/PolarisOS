<script setup>
import { onMounted, provide, useTemplateRef } from "vue";
import ApplicationDock from "./ApplicationDock.vue";
import MinimizedWindow from "./MinimizedWindow.vue";
import { useWindowManager } from "../composables/windowManager.js";
import applications from "../config/applications.js";

const desktopElement = useTemplateRef("desktop");
provide("desktopElement", desktopElement);

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

onMounted(async () => {
  if (window !== window.top) return;

  const path = location.pathname;
  if (path === "/") return;

  const check = await fetch(`/web/${path.slice(1)}`, { method: "HEAD" });
  if (!check.ok) {
    window.history.replaceState({}, "", "/");
    return;
  }

  const browserApplication = applications.browser;
  registerOrSwitch(
    "browser",
    browserApplication.name,
    browserApplication.component,
    {
      ...browserApplication,
      initialURL: path.slice(1),
    },
  );
});
</script>

<template>
  <div class="desktop" ref="desktop">
    <div class="icons">
      <MinimizedWindow
        @click="show(windowID)"
        v-for="windowID in hiddenWindows"
        :key="windowID"
        :title="windows[windowID].title"
        :icon="windows[windowID].icon"
      />
    </div>
    <Component
      :is="windows[windowID].component"
      v-for="windowID in windowOrder"
      v-show="!hiddenWindows.has(windowID)"
      :window-i-d="windowID"
      v-bind="windows[windowID]"
      :key="windowID"
      :active="focusOrder[focusOrder.length - 1] === windowID"
      :style="{ zIndex: focusOrder.indexOf(windowID) + 1 }"
      @focus="bringToFront(windowID)"
      @move="move(windowID, $event)"
      @resize="resize(windowID, $event)"
      @close="close(windowID)"
      @minimize="hide(windowID)"
    ></Component>
    <ApplicationDock />
  </div>
</template>

<style lang="css" scoped>
.desktop {
  position: relative;
  overflow: hidden;
  width: 1024px;
  height: 768px;
  border-radius: 10px;
  display: grid;
  grid-template-rows: 1fr min-content;
  image-rendering: pixelated;
  background: url("img/wallpaper.png") repeat-x;
  font-family: serif, "Tiny5", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 16px;
  user-select: none;
}

.dock {
  grid-row: 2;
}

.icons {
  --spacing: 24px;

  padding: var(--spacing);
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(5, 1fr);
  gap: var(--spacing);
  grid-auto-flow: column;
  min-height: 0;
}
</style>
