import { defineAsyncComponent } from "vue";
import { waitForAllWindows } from "@/utils/appKit";

export default {
  name: "8-ball",
  icon: "eightball",
  entry: async ({ process }) =>
    waitForAllWindows(process.processID, () => {
      process.createWindow(
        defineAsyncComponent(
          () => import("@/components/applications/EightBallApplication.vue"),
        ),
        {
          title: "Shake me!",
          minimizable: false,
          transparent: true,
          dragDirectly: true,
        },
      );
    }),
};
