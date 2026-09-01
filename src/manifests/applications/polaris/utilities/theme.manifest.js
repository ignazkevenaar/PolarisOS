import { defineAsyncComponent } from "vue";
import { waitForAllWindows } from "@/utils/appKit";

export default {
  name: "Theme",
  icon: "paintroller",
  entry: async ({ process }) =>
    waitForAllWindows(process.processID, () => {
      process.createWindow(
        defineAsyncComponent(
          () => import("@/components/applications/ThemeApplication.vue"),
        ),
        { title: "Theme Settings", width: 640 },
      );
    }),
};
