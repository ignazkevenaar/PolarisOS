import { defineAsyncComponent, markRaw } from "vue";
import { waitForAllWindows } from "@/utils/appKit";

export default {
  name: "Clock",
  icon: {
    component: markRaw(
      defineAsyncComponent(() => import("@/components/icons/ClockIcon.vue")),
    ),
  },
  entry: async ({ process }) =>
    waitForAllWindows(process.processID, () => {
      process.createWindow(
        defineAsyncComponent(
          () => import("@/components/applications/ClockApplication.vue"),
        ),
        { title: "Clock", minimizable: false, width: 192, height: 192 },
      );
    }),
};
