<script setup>
import fonts from "../../config/fonts.js";
import IconButton from "../IconButton.vue";
import { useSettings } from "../../composables/settings.js";

const { settings, setSetting } = useSettings();
</script>
<template>
  <div class="windowContainer">
    <label>System font used on windows, tooltips and text fields:</label>
    <div class="scrollable emboss">
      <div
        v-for="(font, fontID) in fonts"
        :key="fontID"
        class="active bevel"
        :class="{ 'color-tertiary': fontID === settings.font }"
      >
        <div class="emboss space">
          <div class="color-surface">
            <IconButton :text="font.name" @click="setSetting('font', fontID)">
              <div class="fontPreview font" :class="`font-${fontID}`">
                ABCDEFG abcdefg
              </div>
            </IconButton>
          </div>
        </div>
      </div>
    </div>
    <div class="attribution">
      <a
        v-if="fonts[settings.font].link"
        :href="fonts[settings.font].link"
        target="_blank"
        >Source</a
      >
      <p v-if="fonts[settings.font].attribution">
        {{ fonts[settings.font].attribution }}
      </p>
    </div>
  </div>
</template>

<style lang="css" scoped>
.windowContainer {
  display: flex;
  flex-direction: column;
  padding: 16px;
  overflow: hidden;
}

.scrollable {
  overflow: auto;

  button {
    width: 100%;
    font-size: 1rem;
  }

  .fontPreview {
    font-size: 2em;
  }
}

.space {
  margin: 4px;
}

.attribution {
  margin-top: 1em;

  p {
    margin: 0;
  }

  a[href] {
    float: right;
  }
}
</style>
