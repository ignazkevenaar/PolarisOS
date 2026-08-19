import ClockIcon from "../../../components/icons/ClockIcon.vue";
import { useWindowManager } from "../../../composables/windowManager";
import { defineAsyncComponent, markRaw, watch } from "vue";
const { register, processIDsWithOpenWindows } = useWindowManager();

export default {
  name: "test application from manifest!",
  entry: async (processID) => {
    console.log("hello from test application!", processID);

    const promise = new Promise((resolve) => {
      watch(processIDsWithOpenWindows, (newIDs) => {
        if (!newIDs.has(processID)) resolve(0);
      });
    });

    const parentWindowID = register(
      processID,
      "anotherWindow",
      defineAsyncComponent(
        () => import("../../../components/applications/AboutApplication.vue"),
      ),
      { icon: "warning" },
    );

    // Child window!
    register(
      processID,
      "window",
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
      parentWindowID,
    );

    register(
      processID,
      "thirdWindow",
      defineAsyncComponent(
        () => import("../../../components/applications/AboutApplication.vue"),
      ),
      { icon: "error" },
    );

    register(
      processID,
      "forthWindow",
      defineAsyncComponent(
        () =>
          import("../../../components/applications/MemoryGameApplication.vue"),
      ),
      { icon: "mouse" },
    );

    return promise;
  },
};
