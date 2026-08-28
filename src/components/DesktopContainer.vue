<script setup>
import { onMounted, provide, useTemplateRef } from "vue";
import NewApplicationDock from "./NewApplicationDock.vue";
import { useWindowManager } from "../composables/windowManager.js";
import applications from "../config/applications.js";
import { useSettings } from "../composables/settings.js";
import { useWallpaper } from "../composables/wallpaper.js";
import { useProcessManager } from "../composables/processManager.js";
import WindowHost from "./WindowHost.vue";

const { settings } = useSettings();
const { wallpaperStyles } = useWallpaper();
const { initializeApplications, startApplication } = useProcessManager();

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

const { createOrSwitchToExistingWindow } = useWindowManager();

const openBrowser = (URL) => {
  if (!URL) return;

  const browserApplication = applications.browser;
  createOrSwitchToExistingWindow(
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

  window.withPath = () => {
    startApplication("documentApplication", "somePath");
  };

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
    <WindowHost />
    <NewApplicationDock />
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
