<script setup>
import { inject } from "vue";
import LargeIcon from "../LargeIcon.vue";

defineProps({
  active: Boolean,
});

// eslint-disable-next-line no-undef
const version = __APP_VERSION__;
const currentYear = new Date().getFullYear();

const openBrowser = inject("openBrowser");
const baseURL = import.meta.env.BASE_URL;
</script>
<template>
  <div class="container">
    <img
      :src="`${baseURL}/img/applications/about/splash.png`"
      alt="PolarisOS logo"
      class="splash"
      :class="{ dim: !active }"
    />

    <div class="color-surface bevel legal" :class="{ active }">
      <div class="row">
        <LargeIcon icon="ignaz" />

        <table>
          <tbody>
            <tr>
              <td>Version:</td>
              <td>{{ version }}</td>
            </tr>
            <tr>
              <td>Created by:</td>
              <td>Ignaz Kevenaar</td>
            </tr>
            <tr>
              <td>More info and credits:</td>
              <td>
                <a href="#" @click="openBrowser('index')">About PolarisOS</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Copyright &copy; 1994 — {{ currentYear }}
        <a href="https://ignaz.design">Ignaz.design</a>, All rights reserved.<br />
        This Operating System uses open source software. All third party usages
        are mentioned in the about page.
      </p>
    </div>
  </div>
</template>

<style lang="css" scoped>
.container {
  --splash-width: 480px;
  width: var(--splash-width);
}
.content {
  display: flex;
  flex-direction: column;

  .splash {
    background-color: black;
    width: var(--splash-width);
    height: 120px;

    &.dim {
      filter: saturate(0.25);
    }
  }

  .legal {
    box-sizing: border-box;
    padding: 16px;
    width: var(--splash-width);

    p {
      margin: 0;
    }

    .row {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    }

    table {
      td:first-child {
        text-align: right;
      }

      td:last-child {
        font-weight: 600;
      }
    }
  }
}
</style>
