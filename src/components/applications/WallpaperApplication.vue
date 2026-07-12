<script setup>
import { onMounted, ref, useTemplateRef } from "vue";
import ApplicationWindow from "../ApplicationWindow.vue";
import { useSettings } from "../../composables/settings.js";
import wallpapers from "../../config/wallpapers.js";
import IconButton from "../IconButton.vue";
import StyledSelect from "../StyledSelect.vue";
import { useWallpaper } from "../../composables/wallpaper.js";

const baseURL = import.meta.env.BASE_URL;
const { settings, setSetting } = useSettings();
const { wallpaperStyles, isCustomWallpaper } = useWallpaper();

const sizeOptions = [
  {
    text: "Tiled",
    value: "tile",
  },
  {
    text: "Stretched",
    value: "stretch",
  },
  {
    text: "Fitted",
    value: "fit",
  },
  {
    text: "Filled",
    value: "fill",
  },
  {
    text: "Original size",
    value: "original",
  },
];

const buttons = ref(undefined);
const monitorOn = ref(true);
const customWallpaper = ref(undefined);
const filePicker = useTemplateRef("filePicker");

onMounted(() => {
  if (isCustomWallpaper.value) {
    customWallpaper.value = settings.value.wallpaper;
  }

  buttons.value.every((button) => {
    if (button.$el.classList.contains("active")) {
      button.$el.scrollIntoView();
      return false;
    }

    return true;
  });
});

const pickFile = () => {
  filePicker.value.click();
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.addEventListener("load", () => {
    setSetting("wallpaper", reader.result);
    customWallpaper.value = reader.result;
  });

  if (file) {
    reader.readAsDataURL(file);
  }
};
</script>
<template>
  <ApplicationWindow>
    <div class="windowContainer">
      <div class="flex">
        <div class="grid emboss color-container">
          <!-- None-option -->
          <IconButton
            @click="setSetting('wallpaper', undefined)"
            :class="
              settings.wallpaper === undefined
                ? ['color-tertiary', 'active']
                : []
            "
          >
            <div class="desktopColor" />
          </IconButton>
          <!-- Custom options -->
          <IconButton
            v-if="customWallpaper"
            @click="setSetting('wallpaper', customWallpaper)"
            :class="isCustomWallpaper ? ['color-tertiary', 'active'] : []"
          >
            <img :src="customWallpaper" />
          </IconButton>

          <IconButton
            ref="buttons"
            v-for="wallpaper in wallpapers"
            :key="wallpaper.url ?? wallpaper"
            @click="setSetting('wallpaper', wallpaper.url ?? wallpaper)"
            :class="
              (wallpaper.url ?? wallpaper) === settings.wallpaper
                ? ['color-tertiary', 'active']
                : []
            "
          >
            <img
              :src="`${baseURL}/img/wallpapers/${wallpaper.url ?? wallpaper}`"
            />
          </IconButton>
        </div>
      </div>

      <div class="spaceBetween">
        <div class="preview">
          <div
            class="monitor"
            :style="{
              background: `url('${baseURL}/img/applications/wallpapers/monitor.png')`,
            }"
          >
            <div class="contents">
              <Transition>
                <div
                  v-if="monitorOn"
                  class="desktop"
                  :style="wallpaperStyles"
                ></div>
              </Transition>
            </div>
            <div class="button" @click="monitorOn = !monitorOn"></div>
            <div class="indicator" v-if="!monitorOn"></div>
          </div>
        </div>
        <div class="setting">
          <label>Wallpaper size</label>
          <StyledSelect
            :model-value="settings.wallpaperSize"
            @update:model-value="setSetting('wallpaperSize', $event)"
            :options="sizeOptions"
          />
        </div>
        <div class="setting">
          <label>Custom wallpaper</label>
          <IconButton @click="pickFile">Browse...</IconButton>
          <input
            v-show="false"
            ref="filePicker"
            type="file"
            accept="image/*"
            @change="handleFileUpload"
          />
        </div>
      </div>

      <div class="attribution">
        <template
          v-for="wallpaper in [
            wallpapers.find((w) => w.url === settings.wallpaper),
          ]"
          :key="wallpaper"
        >
          <a v-if="wallpaper?.link" :href="wallpaper.link" target="_blank"
            >Source</a
          >
          <p v-if="wallpaper?.attribution">
            {{ wallpaper.attribution }}
          </p>
        </template>
      </div>
    </div>
  </ApplicationWindow>
</template>

<style lang="css" scoped>
.windowContainer {
  padding: 16px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 4fr 3fr;
  grid-template-rows: 1fr auto;
  gap: 8px;
}

.flex {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, 86px);
  grid-auto-rows: 86px;
  flex: 1 1 auto;
  overflow: auto;

  button {
    padding: 0;
    display: grid;
    place-items: center;

    img {
      pointer-events: none;
    }
  }

  img,
  .desktopColor {
    width: 64px;
    height: 64px;
    border: 1px solid black;
    object-fit: contain;
    background-color: rgb(var(--color-desktop));
  }

  .space {
    margin: 4px;
  }
}

.attribution {
  margin-top: 1em;
  grid-column: span 2;

  p {
    margin: 0;
  }

  a[href] {
    float: right;
  }
}

.spaceBetween {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.preview {
  display: flex;
  justify-content: center;
  margin-bottom: 8px;

  .monitor {
    position: relative;
    width: 176px;
    height: 164px;
    display: grid;
    place-items: center;

    .contents {
      border: 1px solid black;
      border-radius: 3px;
      width: 144px;
      height: 119px;
      box-sizing: border-box;
      position: relative;
      top: -10px;
      overflow: hidden;
    }

    .desktop {
      width: 100%;
      height: 100%;
      will-change: transform, filter;
    }

    .button,
    .indicator {
      position: absolute;
    }

    .button {
      width: 20px;
      height: 14px;
      bottom: 8px;
      right: 20px;
      cursor: pointer;
    }

    .indicator {
      width: 5px;
      height: 1px;
      bottom: 15px;
      right: 46px;
      background-color: black;
    }
  }
}

.setting {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 4px;
}

.v-enter-active {
  transition:
    scale 2s ease-in,
    filter 2s ease-in;
}

.v-enter-from {
  filter: brightness(0) contrast(2) blur(3px);
  scale: 110%;
}

.v-leave-active {
  transition:
    scale 0.15s ease-in-out,
    filter 0.15s ease-in-out;
}

.v-leave-to {
  scale: 200% 0%;
  filter: grayscale(1) brightness(10) blur(2px);
}
</style>
