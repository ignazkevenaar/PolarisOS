import { defineAsyncComponent } from "vue";
import { waitForAllWindows } from "@/utils/appKit";

export default {
  name: "File Explorer",
  icon: "cabinet",
  entry: async ({ process }) =>
    waitForAllWindows(process.processID, () => {
      process.createWindow(
        defineAsyncComponent(
          () => import("@/components/applications/ExplorerApplication.vue"),
        ),
        { title: "File Explorer", icon: "folder", width: 640, height: 360 },
      );
    }),
};
