import { defineAsyncComponent } from "vue";
import { waitForAllWindows } from "@/utils/appKit";

export default {
  name: "Shredder",
  icon: "shredder",
  entry: async ({ process }) =>
    waitForAllWindows(process.processID, () => {
      process.createWindow(
        defineAsyncComponent(
          () => import("@/components/applications/ShredderApplication.vue"),
        ),
        {
          title: "Shredder",
          closable: false,
          minimizable: false,
          center: true,
        },
      );
    }),
};
