<script setup>
import { onMounted, provide, useTemplateRef } from "vue";
import ApplicationDock from "./ApplicationDock.vue";
import MinimizedWindow from "./MinimizedWindow.vue";
import { useWindowManager } from "../composables/windowManager.js";
import applications from "../config/applications.js";
import { useSettings } from "../composables/settings.js";
import { useWallpaper } from "../composables/wallpaper.js";

const { settings } = useSettings();
const { wallpaperStyles } = useWallpaper();

const props = defineProps({
  initialURL: {
    type: String,
    // 404.astro can't know the requested path at build time, so it stashes
    // it on window.__outsidePath before this island hydrates.
    default: () =>
      typeof window !== "undefined" ? window.__outsidePath : undefined,
  },
});

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
  if (!props.initialURL) return;

  const baseURL = import.meta.env.BASE_URL;
  const homePath = `${baseURL}/`;
  const path = props.initialURL;
  if (path === homePath || path === baseURL) return;

  const check = await fetch(`${baseURL}/web/${path}`, {
    method: "HEAD",
  });
  if (!check.ok) {
    console.warn("Invalid URL", path, check);
    window.history.replaceState({}, "", homePath);
    return;
  }

  openBrowser(path);
});

const unfocusWindows = () => {
  bringToFront("dock");
};

// eslint-disable-next-line no-undef
const version = __APP_VERSION__;
</script>

<template>
  <div
    class="desktop theme font"
    :class="[`theme-${settings.theme}`, `font-${settings.font}`]"
    :style="wallpaperStyles"
    ref="desktop"
  >
    <p class="evaluation">Evaluation copy. Version {{ version }}</p>
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
      :active="focusOrder.at(-1) === windowID && !hiddenWindows.has(windowID)"
      :z-index="focusOrder.indexOf(windowID) + 1"
      @focus="bringToFront(windowID)"
      @drag-move="move(windowID, $event)"
      @drag-end="move(windowID, $event)"
      @resize="resize(windowID, $event)"
      @close="close(windowID)"
      @minimize="hide(windowID)"
    ></Component>
    <ApplicationDock :active="focusOrder.at(-1) === 'dock'" />
  </div>
</template>

<style>
html,
body {
  background-color: black;
  display: grid;
  place-items: center;
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
}
</style>

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
  font-weight: 400;
  font-style: normal;
  user-select: none;
  z-index: 0; /* Window 'animation' when closing */
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

.evaluation {
  color: white;
  margin: 4px;
  position: absolute;
  inset: 0;
  text-align: right;
  font-family: monospace;
  text-shadow: 0 1px 0 black;
}
</style>
