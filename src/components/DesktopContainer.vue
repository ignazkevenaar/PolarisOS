<script setup>
import { onMounted, provide, useTemplateRef } from "vue";
import NewApplicationDock from "./NewApplicationDock.vue";
import { useWindowManager } from "../composables/windowManager.js";
import applications from "../config/applications.js";
import { useSettings } from "../composables/settings.js";
import { useWallpaper } from "../composables/wallpaper.js";
import { useProcessManager } from "../composables/processManager.js";

const { settings } = useSettings();
const { wallpaperStyles } = useWallpaper();
const { processes, initializeApplications, startApplication, stopProcess } =
  useProcessManager();

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
  hiddenWindows,
  minimizedWindows,
  bringToFront,
  move,
  resize,
  close,
  minimize,
  focus,
  registerOrSwitch,
  focusedWindowID,
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
  await initializeApplications();

  // const [newID, done] = createProcess();
  // console.log("Hello from user land", newID);
  // await new Promise((resolve) => setTimeout(resolve, 5000));
  // done(0);

  const { done: applicationOne } = await startApplication(
    "design.ignaz.polarisos.test",
  );

  await startApplication("design.ignaz.polarisos.test");

  window.stopProcess = () => {
    stopProcess(Object.keys(processes.value).at(-1));
  };

  const { done: applicationTwo } = await startApplication(
    "polaris/anothertest",
  );

  await Promise.all([applicationOne, applicationTwo]);
  console.log("all apps done jeuj");

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
    <!-- {{ processIDsWithOpenWindows }} -->
    <!-- <pre style="background-color: rgb(255 255 255 / 0.5)">{{ processes }}</pre> -->
    <!-- <pre
      style="
        background-color: rgb(255 255 255 / 0.5);
        max-height: 500px;
        overflow: scroll;
        position: relative;
        z-index: 1;
      "
      >{{ orderedProcessessAndWindows }}</pre> -->
    <!-- <div class="clickable" @click="unfocusWindows" /> -->
    <!--
    <div class="icons">
      <MinimizedWindow
        @click="show(windowID)"
        v-for="windowID in minimizedWindows"
        :key="windowID"
        :title="windows[windowID].title"
        :icon="windows[windowID].icon"
      />
    </div>
    -->

    <template v-for="(window, windowID) in windows" :key="windowID">
      <Component
        :is="window.component"
        :hidden="minimizedWindows.has(windowID) || hiddenWindows.has(windowID)"
        :window-i-d="windowID"
        v-bind="window"
        :active="focusedWindowID === windowID"
        :z-index="windowOrder.indexOf(windowID) + 1"
        @focus="
          focus(windowID);
          bringToFront(windowID);
        "
        @drag-move="move(windowID, $event)"
        @drag-end="move(windowID, $event)"
        @resize="resize(windowID, $event)"
        @close="close(windowID)"
        @minimize="minimize(windowID)"
      ></Component>
    </template>
    <NewApplicationDock />
    {{ focusedWindowID }}
  </div>
</template>

<style>
html,
body {
  display: grid;
  place-items: center;
  margin: 0;
  background-color: black;
  padding: 0;
  width: 100vw;
  height: 100vh;
}
</style>

<style lang="css" scoped>
.desktop {
  --margin: 32px;
  display: grid;

  position: relative;
  grid-template-rows: 1fr min-content;
  z-index: 0; /* Window 'animation' when closing */
  margin: --margin;
  border-radius: 10px;
  image-rendering: pixelated;
  width: 1024px;
  height: 768px;
  overflow: hidden;
  font-style: normal;
  font-weight: 400;
  user-select: none;
}

.clickable {
  position: absolute;
  inset: 0;
}

.dock {
  grid-row: 2;
}

/* .icons {
  --spacing: 24px;
  display: grid;

  position: relative;
  grid-template-rows: repeat(auto-fit, 110px);
  grid-auto-columns: 86px;
  grid-auto-flow: column;
  gap: var(--spacing);
  z-index: 0;
  padding: var(--spacing);
  min-height: 0;
  pointer-events: none;

  > * {
    pointer-events: initial;
  }
} */

.evaluation {
  position: absolute;
  margin: 4px;
  inset: 0;
  color: white;
  font-family: monospace;
  text-align: right;
  text-shadow: 0 1px 0 black;
}
</style>
