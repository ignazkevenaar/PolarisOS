<script setup>
import { ref, onMounted, provide, useTemplateRef } from "vue";
import ApplicationDock from "./ApplicationDock.vue";
import MinimizedWindow from "./MinimizedWindow.vue";
import { useWindowManager } from "../composables/windowManager.js";
import applications from "../config/applications.js";
import themes from "../config/themes.js";
import fonts from "../config/fonts.js";

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

const theme = ref(Object.keys(themes)[0]);
const setTheme = (newTheme) => {
  theme.value = newTheme;
};
provide("theme", theme);
provide("setTheme", setTheme);

const font = ref(Object.keys(fonts)[0]);
const setFont = (newFont) => {
  font.value = newFont;
};
provide("font", font);
provide("setFont", setFont);

const openBrowser = (URL) => {
  if (!URL) return;

  const browserApplication = applications.browser;
  registerOrSwitch(
    "browser",
    browserApplication.name,
    browserApplication.component,
    {
      ...browserApplication,
      initialURL: URL,
    },
  );

  return true;
};
provide("openBrowser", openBrowser);

onMounted(async () => {
  // Prevent recursive loading in <iframe>
  if (window !== window.top) return;

  const path = location.pathname;
  if (path === "/") return;

  const check = await fetch(`/web/${path.slice(1)}`, { method: "HEAD" });
  if (!check.ok) {
    console.warn("Invalid URL", path, check);
    window.history.replaceState({}, "", "/");
    return;
  }

  openBrowser(path.slice(1));
});

const unfocusWindows = () => {
  bringToFront("dock");
};
</script>

<template>
  <div
    class="desktop theme"
    :class="[`theme-${theme}`, `font-${font}`]"
    ref="desktop"
  >
    <div class="clickable" @click="unfocusWindows" />
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
      :active="focusOrder.at(-1) === windowID"
      :style="{ zIndex: focusOrder.indexOf(windowID) + 1 }"
      @focus="bringToFront(windowID)"
      @drag-move="move(windowID, $event)"
      @resize="resize(windowID, $event)"
      @close="close(windowID)"
      @minimize="hide(windowID)"
    ></Component>
    <ApplicationDock :active="focusOrder.at(-1) === 'dock'" />
  </div>
</template>

<style lang="css" scoped>
.desktop {
--margin: 32px;

  position: relative;
  overflow: hidden;
  width: 1024px;
  height: 768px;
  margin: --margin;
  border-radius: 10px;
  display: grid;
  grid-template-rows: 1fr min-content;
  image-rendering: pixelated;
  background: rgb(var(--color-desktop));
  font-weight: 400;
  font-style: normal;
  user-select: none;
}

.clickable {
  position: absolute;
  inset: 0;
}

.dock {
  grid-row: 2;
}

.icons {
  --spacing: 24px;

  position: relative;
  z-index: 0;
  padding: var(--spacing);
  display: grid;
  grid-auto-columns: 86px;
  grid-template-rows: repeat(auto-fit, 110px);
  gap: var(--spacing);
  grid-auto-flow: column;
  min-height: 0;
  pointer-events: none;

  > * {
    pointer-events: initial;
  }
}
</style>
