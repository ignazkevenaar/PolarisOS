<script setup>
import { ref } from "vue";
import ApplicationWindow from "../ApplicationWindow.vue";
import { useWindowManager } from "../../composables/windowManager.js";
import StyledInput from "../StyledInput.vue";
import bookmarks from "../../config/bookmarks.js";
import IconButton from "../IconButton.vue";
import bubbleIframeMouseEvents from "../../utils/bubbleIframeMouseEvents.js";

const { changeTitle } = useWindowManager();

const props = defineProps({
  windowID: {
    type: String,
    required: true,
  },
  initialURL: { type: String, default: "index" },
});

const urlScope = "web/";
const currentURL = ref(props.initialURL);
const browserLocation = ref("");
const iframeEl = ref(null);

const loadURL = (url) => {
  currentURL.value = url;
  iframeEl.value.src = `/${urlScope}${url}`;
};

const normalizeURL = (url) =>
  url.replace(/index\.html$/, "").replace(/index$/, "") || url;

const onNavigate = (event) => {
  const contentWindow = event.target.contentWindow;
  let href;

  try {
    href = contentWindow.location.href;
  } catch {
    return;
  }

  const prefix = `${location.origin}/${urlScope}`;
  const raw = href.startsWith(prefix) ? href.slice(prefix.length) : href;
  const normalizedURL = normalizeURL(raw);

  currentURL.value = normalizedURL;

  window.history.replaceState({ url: normalizedURL }, "", `/${normalizedURL}`);
  browserLocation.value = currentURL.value;
  changeTitle(props.windowID, `${contentWindow.document.title} — Browser`);

  bubbleIframeMouseEvents(event.target);
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
  iframeEl.value.contentWindow.history.back();
};

const navigateForward = () => {
  iframeEl.value.contentWindow.history.forward();
};

const navigateHome = () => {
  navigateTo("index");
};

const openCurrentPageInNewWindow = () => {
  const url = "/" + urlScope + currentURL.value;
  console.log(url);
  window.open(url, "_blank").focus();
};

const selectAll = (event) => {
  event.target.select();
};

const clearHistory = () => {
  window.history.pushState({}, "", `/`);
};
</script>
<template>
  <ApplicationWindow @close="clearHistory">
    <template #default="{ active }">
      <div class="grid">
        <div class="toolbarContainer">
          <div class="toolbar color-surface" :class="{ active }">
            <IconButton text="Back" icon="back" @click="navigateBack" />
            <IconButton
              text="Forward"
              icon="forward"
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
              text="Open externally"
              icon="external"
              @click="openCurrentPageInNewWindow"
            />
            <div class="throbber">
              <!-- Add some sick animated gif -->
            </div>
          </div>

          <div class="bookmarks bevel color-secondary" :class="{ active }">
            <ul>
              <li
                v-for="(bookmark, bookmarkIndex) in bookmarks"
                :key="bookmarkIndex"
              >
                <i class="icon-16 bookmark" />
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
        <iframe
          ref="iframeEl"
          :src="`/${urlScope}${props.initialURL}`"
          @load="onNavigate"
        ></iframe>
      </div>
    </template>
  </ApplicationWindow>
</template>

<style lang="css" scoped>
.grid {
  place-self: stretch;
  display: grid;
  grid-template-rows: auto 1fr;
}

iframe {
  place-self: stretch;
}

.toolbarContainer {
  min-width: 0;
}

.toolbar {
  display: flex;
  align-items: stretch;

  input {
    flex: 1;
    min-width: 0;
  }

  .throbber {
    height: 48px;
    width: 48px;
    background-color: black;
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
      text-decoration: underline;
      display: flex;
      align-items: center;
      gap: 4px;

      a,
      a:visited {
        color: inherit;
      }
    }
  }
}
</style>
