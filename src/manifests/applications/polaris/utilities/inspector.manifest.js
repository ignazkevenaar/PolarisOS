import { defineAsyncComponent } from "vue";
import { waitForAllWindows } from "@/utils/appKit";

export default {
  name: "Inspector",
  icon: "inspector",
  entry: async ({ process }) =>
    waitForAllWindows(process.processID, () => {
      process.createWindow(
        defineAsyncComponent(
          () => import("@/components/applications/InspectorApplication.vue"),
        ),
        { title: "Inspector", width: 800, height: 600 },
      );
    }),
};
