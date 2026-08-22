import ClockIcon from "../../../components/icons/ClockIcon.vue";
import { useWindowManager } from "../../../composables/windowManager";
import { defineAsyncComponent, markRaw, watch } from "vue";
const { createWindow, processIDsWithOpenWindows } = useWindowManager();

export default {
  name: "test application from manifest!",
  entry: async (processID) => {
    console.log("hello from test application!", processID);

    const promise = new Promise((resolve) => {
      watch(processIDsWithOpenWindows, (newIDs) => {
        if (!newIDs.has(processID)) resolve(0);
      });
    });

    const parentWindow = createWindow(
      processID,
      defineAsyncComponent(
        () => import("../../../components/applications/AboutApplication.vue"),
      ),
      { icon: "warning" },
    );

    // Child window!
    createWindow(
      processID,
      defineAsyncComponent(
        () => import("../../../components/applications/ClockApplication.vue"),
      ),
      {
        title: "cccllloooccckkk",
        icon: {
          component: markRaw(ClockIcon),
        },
        // alwaysOnTop: true,
      },
      parentWindow.windowID,
    );

    createWindow(
      processID,
      defineAsyncComponent(
        () => import("../../../components/applications/AboutApplication.vue"),
      ),
      { icon: "error" },
    );

    createWindow(
      processID,
      defineAsyncComponent(
        () =>
          import("../../../components/applications/MemoryGameApplication.vue"),
      ),
      { icon: "mouse" },
    );

    return promise;
  },
};
