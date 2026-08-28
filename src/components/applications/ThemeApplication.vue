<script setup>
import themes from "../../config/themes.js";
import IconButton from "../IconButton.vue";
import StyledInput from "../StyledInput.vue";
import { useSettings } from "../../composables/settings.js";

const { settings, setSetting } = useSettings();
</script>
<template>
  <div class="windowContainer">
    <label> System theme used for desktop, windows, inputs and buttons: </label>
    <div class="scrollable emboss">
      <div
        v-for="(theme, themeID) in themes"
        :key="themeID"
        class="active bevel"
        :class="{ 'color-tertiary': themeID === settings.theme }"
      >
        <div class="emboss space">
          <div class="color-surface">
            <IconButton
              :text="theme.name"
              @click="setSetting('theme', themeID)"
            >
              <div class="mockDesktop" :class="`theme-${themeID}`">
                <div class="mockWindow bevel color-primary active">
                  <div class="emboss container">
                    <div class="titlebar">
                      <div class="bevel close"><div class="bevel"></div></div>
                      <div class="bevel title">
                        <span class="text-shadow">Window title</span>
                      </div>
                      <div class="bevel minimize">
                        <div class="bevel"></div>
                      </div>
                    </div>
                    <div class="color-surface bevel content">
                      <label>Name</label>
                      <StyledInput disabled class="input active" />
                      <div class="end">
                        <IconButton text="Ok" disabled></IconButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </IconButton>
          </div>
        </div>
      </div>
    </div>
    <div class="attribution">
      <a
        v-if="themes[settings.theme].link"
        :href="themes[settings.theme].link"
        target="_blank"
        >Source</a
      >
      <p v-if="themes[settings.theme].attribution">
        {{ themes[settings.theme].attribution }}
      </p>
    </div>
  </div>
</template>

<style lang="css" scoped>
.windowContainer {
  padding: 16px;
  overflow: hidden;
}

.scrollable {
  display: flex;
  padding: 8px;
  overflow: auto;
}

.space {
  margin: 4px;
}

.mockDesktop {
  margin: 8px;
  border: 1px solid black;
  border-radius: 4px;
  background: rgb(var(--color-desktop));
  padding: 8px;
  width: 172px;
  pointer-events: none;
}

.mockWindow {
  .container {
    display: grid;
    margin: 2px;
  }

  .titlebar {
    --border-width: 1px;

    display: flex;
    min-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    > * {
      box-sizing: border-box;
    }

    .close,
    .minimize {
      display: grid;
      flex: 0 0 auto;
      place-items: center;
      aspect-ratio: 1;
      height: 100%;
    }

    .close .bevel {
      width: 8px;
      height: 8px;
    }
    .minimize .bevel {
      width: 12px;
      height: 2px;
    }

    .title {
      display: flex;
      flex: 1;
      justify-content: center;
      align-items: center;
      min-width: 0;

      span {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 8px;
    overflow: hidden;
    text-align: start;

    > *:not(:last-child) {
      margin-bottom: 4px;
    }

    label {
      display: block;
    }

    .end {
      display: flex;
      justify-content: flex-end;
    }

    button {
      padding-block: 2px;
    }
  }
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
