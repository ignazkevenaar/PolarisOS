import { defineAsyncComponent } from "vue";
import { waitForAllWindows } from "@/utils/appKit";

export default {
  name: "About",
  icon: "application",
  entry: async ({ process }) =>
    waitForAllWindows(process.processID, () => {
      process.createWindow(
        defineAsyncComponent(
          () => import("@/components/applications/AboutApplication.vue"),
        ),
        { title: "About PolarisOS", minimizable: false },
      );
    }),
};
