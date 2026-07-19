// @ts-check
import { defineConfig } from "astro/config";
import process from "process";

import vue from "@astrojs/vue";

// https://astro.build/config
export default defineConfig({
  site: "https://ignazkevenaar.github.io",
  base: "/PolarisOS",
  outDir: "./dist", // Default
  integrations: [vue()],
  build: {
    format: "preserve",
  },
  compressHTML: true,
  vite: {
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
    build: {
      rolldownOptions: {
        // TODO: Remove when updating vueuse beyond v14.3.0
        // https://github.com/vueuse/vueuse/issues/5387#issuecomment-4727873708
        onwarn(warning, warn) {
          if (warning.code === "INVALID_ANNOTATION") {
            return;
          }

          warn(warning);
        },
      },
    },
  },
});
