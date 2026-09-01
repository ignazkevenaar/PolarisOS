import { defineAsyncComponent } from "vue";
import { waitForAllWindows } from "@/utils/appKit";

export default {
  name: "Font",
  icon: "fonts",
  entry: async ({ process }) =>
    waitForAllWindows(process.processID, () => {
      process.createWindow(
        defineAsyncComponent(
          () => import("@/components/applications/FontApplication.vue"),
        ),
        { title: "Font Settings", width: 640, height: 480 },
      );
    }),
};
