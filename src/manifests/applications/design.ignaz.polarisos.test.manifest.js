import ClockIcon from "../../components/icons/ClockIcon.vue";
import { useWindowManager } from "../../composables/windowManager";
import { defineAsyncComponent, markRaw, watch } from "vue";
const { register, processIDsWithOpenWindows } = useWindowManager();

export default {
  name: "test application from manifest!",
  icon: "cd",
  reEntry: async (processID) => {
    const parentWindowID = register(
      processID,
      "anotherWindow",
      defineAsyncComponent(
        () => import("../../components/applications/AboutApplication.vue"),
      ),
      { icon: "warning" },
    );

    // Child window!
    register(
      processID,
      "window",
      defineAsyncComponent(
        () => import("../../components/applications/ClockApplication.vue"),
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
        () => import("../../components/applications/AboutApplication.vue"),
      ),
      { icon: "error" },
    );
  },
  entry: async (processID, registerMessageListener) => {
    console.log("hello from test application!", processID);

    registerMessageListener((message) => {
      console.log("received message", message);
    });

    const promise = new Promise((resolve) => {
      // watch(processIDsWithOpenWindows, (newIDs) => {
      //   if (!newIDs.has(processID)) resolve(0);
      // });

      window.stop = () => {
        console.log("Stopping app");
        resolve(0);
      };
    });

    return promise;
  },
};
