import { defineAsyncComponent } from "vue";
import { waitForAllWindows } from "@/utils/appKit";

export default {
  name: "test application from manifest!",
  icon: "application",
  entry: async ({ process }) =>
    waitForAllWindows(process.processID, () => {
      process.createWindow(
        defineAsyncComponent(
          () => import("../../../components/applications/AboutApplication.vue"),
        ),
        { title: "About Polaris", icon: "error" },
      );

      process.createWindow(
        defineAsyncComponent(
          () =>
            import("../../../components/applications/MemoryGameApplication.vue"),
        ),
        {
          title: "Memory Game",
          icon: "mouse",
          resizable: true,
          width: 480, // Content
          height: 560,
        },
      );
    }),
};
