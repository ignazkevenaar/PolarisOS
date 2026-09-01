import { defineAsyncComponent } from "vue";
import { waitForAllWindows } from "@/utils/appKit";

export default {
  name: "XEyes",
  icon: "eyes",
  entry: async ({ process }) =>
    waitForAllWindows(process.processID, () => {
      process.createWindow(
        defineAsyncComponent(
          () => import("@/components/applications/XEyesApplication.vue"),
        ),
        { title: "XEyes", minimizable: false, transparent: true },
      );
    }),
};
