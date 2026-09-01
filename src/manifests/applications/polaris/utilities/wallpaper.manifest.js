import { defineAsyncComponent } from "vue";
import { waitForAllWindows } from "@/utils/appKit";

export default {
  name: "Wallpaper",
  icon: "wallpaper",
  entry: async ({ process }) =>
    waitForAllWindows(process.processID, () => {
      process.createWindow(
        defineAsyncComponent(
          () => import("@/components/applications/WallpaperApplication.vue"),
        ),
        { title: "Wallpaper Settings", width: 640, height: 480 },
      );
    }),
};
