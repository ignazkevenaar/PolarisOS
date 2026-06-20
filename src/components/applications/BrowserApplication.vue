<script setup>
import { ref, watch } from "vue";
import ApplicationWindow from "../ApplicationWindow.vue";
import { useWindowManager } from "../../composables/windowManager.js";
import StyledInput from "../StyledInput.vue";
import bookmarks from "../../config/bookmarks.js";
import IconButton from "../IconButton.vue";

const { changeTitle } = useWindowManager();

const props = defineProps({
  windowID: {
    type: String,
    required: true,
  },
  initialURL: { type: String, default: "index.html" },
});

const urlScope = "web/";
const currentURL = ref(props.initialURL);
const pageTitle = ref(undefined);
const browserLocation = ref("");

const normalizeURL = (url) =>
  url
    .replace(/\/index\.html$/, "")
    .replace(/\/index$/, "")
    .replace(/\/$/, "") || url;

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
  currentURL.value = normalizeURL(raw);
  pageTitle.value = contentWindow.document.title;
  browserLocation.value = currentURL.value;
  changeTitle(props.windowID, `${pageTitle.value} - WWW`);
};

watch(
  currentURL,
  (newURL) => {
    window.history.pushState({}, "", `/${newURL}`);
  },
  { immediate: true },
);

const navigateTo = (url) => {
  currentURL.value = url ?? browserLocation.value;
};

const handleLocationKeyDown = (event) => {
  if (event.key === "Enter") {
    navigateTo();
  }
};

const navigateHome = () => {
  currentURL.value = "index";
};

const openCurrentPageInNewWindow = () => {
  window.open(urlScope + currentURL.value, "_blank").focus();
};

const selectAll = (event) => {
  event.target.select();
};
</script>
<template>
  <ApplicationWindow>
    <template #default="{ active }">
      <div class="grid">
        <div>
          <div class="toolbar color-surface" :class="{ active }">
            <IconButton text="Back" icon="back" />
            <IconButton text="Forward" icon="forward" />
            <IconButton text="Home" icon="home" @click="navigateHome" />
            <StyledInput
              v-model="browserLocation"
              @keydown="handleLocationKeyDown"
              @focus="selectAll"
            />
            <IconButton text="Go" icon="go" @click="navigateHome" />
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

        <iframe :src="`/${urlScope}${currentURL}`" @load="onNavigate"></iframe>
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

.toolbar {
  display: flex;
  align-items: stretch;

  input {
    flex: 1;
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
      color: white;
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
