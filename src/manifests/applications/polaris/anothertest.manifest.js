import { defineAsyncComponent } from "vue";
import { waitForAllWindows } from "@/utils/appKit";

export default {
  name: "test application from manifest!",
  entry: async ({ process }) =>
    waitForAllWindows(process.processID, () => {
      process.createWindow(
        defineAsyncComponent(
          () => import("../../../components/applications/AboutApplication.vue"),
        ),
        { icon: "error" },
      );

      process.createWindow(
        defineAsyncComponent(
          () =>
            import("../../../components/applications/MemoryGameApplication.vue"),
        ),
        { icon: "mouse" },
      );
    }),
};
