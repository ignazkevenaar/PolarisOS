<script setup>
import { onMounted, ref, useTemplateRef, watch } from "vue";
import ApplicationWindow from "../ApplicationWindow.vue";
import { useWindowManager } from "../../composables/windowManager.js";
import StyledInput from "../StyledInput.vue";
import bookmarks from "../../config/bookmarks.js";
import IconButton from "../IconButton.vue";
import bubbleIframePointerEvents from "../../utils/bubbleIframePointerEvents.js";
import { injectStyles } from "../../config/injectStyles.js";
import { useSettings } from "../../composables/settings.js";
import SmallIcon from "../SmallIcon.vue";

const { settings } = useSettings();
const { changeTitle } = useWindowManager();

const props = defineProps({
  windowID: {
    type: String,
    required: true,
  },
  initialURL: { type: String, default: undefined },
});

const windowElement = useTemplateRef("window");

const baseURL = import.meta.env.BASE_URL;
const urlScope = `${baseURL}/web/`;
const currentURL = ref(props.initialURL);
const browserLocation = ref("");
const iframeEl = ref(null);
const throbberOn = ref(false);

const frameContentWindow = ref(undefined);
const iframeBackDepth = ref(0);
const iframeMaxDepth = ref(0);
let isIframeFirstLoad = true;
let pendingNavBack = false;
let pendingNavForward = false;

const loadURL = (url) => {
  currentURL.value = url;
  iframeEl.value.src = `${urlScope}${url}`;
};

const normalizeURL = (url) =>
  url.replace(/index\.html$/, "").replace(/index$/, "") || url;

const handleMessage = (event) => {
  console.log("Message!", event);
};

const onNavigate = (event) => {
  const contentWindow = event.target.contentWindow;
  frameContentWindow.value = contentWindow;

  let href;

  contentWindow.addEventListener("message", handleMessage);

  try {
    href = contentWindow.location.href;
  } catch {
    return;
  }

  if (!isIframeFirstLoad && !pendingNavBack) {
    iframeBackDepth.value++;

    if (!pendingNavForward) {
      iframeMaxDepth.value = iframeBackDepth.value;
    }
  }
  isIframeFirstLoad = false;
  pendingNavBack = false;
  pendingNavForward = false;

  const prefix = `${location.origin}${urlScope}`;
  const raw = href.startsWith(prefix) ? href.slice(prefix.length) : href;
  const normalizedURL = normalizeURL(raw);

  currentURL.value = normalizedURL;

  window.history.replaceState(
    { url: normalizedURL },
    "",
    `${baseURL}/${normalizedURL}`,
  );
  browserLocation.value = currentURL.value;
  changeTitle(props.windowID, `${contentWindow.document.title} — Browser`);

  injectStyles(windowElement.value.$el, contentWindow.document.documentElement);
  bubbleIframePointerEvents(event.target);

  throbberOn.value = true;
};

const navigateTo = (url) => {
  loadURL(url ?? browserLocation.value);
};

const handleLocationKeyDown = (event) => {
  if (event.key === "Enter") {
    navigateTo();
  }
};

const navigateBack = () => {
  if (iframeBackDepth.value > 0) {
    pendingNavBack = true;
    iframeEl.value.contentWindow.history.back();
    iframeBackDepth.value--;
  }
};

const navigateForward = () => {
  pendingNavForward = true;
  iframeEl.value.contentWindow.history.forward();
};

const navigateHome = () => {
  navigateTo("about-polaris");
};

const openCurrentPageInNewWindow = () => {
  const url = urlScope + currentURL.value;
  window.open(url, "_blank").focus();
};

const selectAll = (event) => {
  event.target.select();
};

const clearHistory = () => {
  window.history.pushState({}, "", `${baseURL}/`);
};

watch([() => settings.value.theme, () => settings.value.font], () => {
  console.log("watcher fires");

  injectStyles(
    windowElement.value.$el,
    frameContentWindow.value.document.documentElement,
  );
});

onMounted(() => {
  if (!props.initialURL) navigateHome();
});
</script>
<template>
  <ApplicationWindow @close="clearHistory" ref="window">
    <template #toolbar="{ active }">
      <div class="toolbarContainer">
        <div class="toolbar color-surface apply-color" :class="{ active }">
          <IconButton
            text="Back"
            icon="back"
            :disabled="iframeBackDepth === 0"
            @click="navigateBack"
          />
          <IconButton
            text="Forward"
            icon="forward"
            :disabled="iframeBackDepth >= iframeMaxDepth"
            @click="navigateForward"
          />
          <IconButton text="Home" icon="home" @click="navigateHome" />
          <StyledInput
            v-model="browserLocation"
            @keydown="handleLocationKeyDown"
            @focus="selectAll"
          />
          <IconButton text="Go" icon="go" @click="navigateTo()" />
          <IconButton
            text="View"
            icon="external"
            @click="openCurrentPageInNewWindow"
          />
          <div class="throbberContainer bevel color-secondary">
            <div
              class="throbber emboss"
              :class="{ on: throbberOn }"
              @animationend="throbberOn = false"
            >
              <!-- Add some sick animated gif -->
            </div>
          </div>
        </div>

        <div class="bookmarks bevel color-secondary" :class="{ active }">
          <ul>
            <li
              v-for="(bookmark, bookmarkIndex) in bookmarks"
              :key="bookmarkIndex"
            >
              <SmallIcon icon="bookmark" />
              <a v-if="!bookmark.target" @click="navigateTo(bookmark.href)">{{
                bookmark.text
              }}</a>
              <a v-else :href="bookmark.href" :target="bookmark.target">{{
                bookmark.text
              }}</a>
            </li>
          </ul>
        </div>
      </div>
    </template>

    <div class="container color-container emboss">
      <iframe
        ref="iframeEl"
        :src="`${urlScope}${props.initialURL}`"
        @load="onNavigate"
      ></iframe>
    </div>
  </ApplicationWindow>
</template>

<style lang="css" scoped>
.container {
  margin: 6px;
  place-self: stretch;
  position: relative;
  display: grid;
  place-items: stretch;

  iframe {
    border: none;
  }
}

.toolbarContainer {
  min-width: 0;
}

@keyframes throbber {
  0% {
    background-color: black;
  }
  33% {
    background-color: blue;
  }
  66% {
    background-color: palevioletred;
  }
  100% {
    background-color: black;
  }
}

.toolbar {
  display: flex;
  align-items: stretch;

  input {
    flex: 1;
    min-width: 0;
    margin: 4px;
  }

  .throbberContainer {
    aspect-ratio: 1;
    display: grid;
    place-items: center;
  }

  .throbber {
    height: 48px;
    width: 48px;
    background-color: black;
    box-sizing: content-box;

    &.on {
      animation: throbber 1s both;
    }
  }
}

.bookmarks {
  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
    display: flex;
    gap: 8px;

    li {
      padding: 2px 4px;
      display: flex;
      align-items: center;
      gap: 4px;

      a,
      a:visited {
        text-decoration: none;
        color: inherit;
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
