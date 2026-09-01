import { defineAsyncComponent } from "vue";
import { useWindowManager } from "@/composables/windowManager.js";

const { windows } = useWindowManager();

let windowID;

// Single window application:
// Only a single window is allowed to be open at the time.

// Application that keeps running, even with no windows.
// Provide a clear way of stopping the application:
// * Menu
// * Task manager

export default {
  name: "Browser",
  icon: "browser",
  fileAssociations: ["link"],
  entry: async ({ process, path, registerEventListener }) => {
    const createWindow = (initialURL) => {
      windowID = process.createWindow(
        defineAsyncComponent(
          () =>
            import("../../../components/applications/BrowserApplication.vue"),
        ),
        {
          title: "Browser",
          icon: process.icon, // TODO: genericize this maybe.
          width: 800,
          height: 600,
          resizable: true,
        },
        {
          initialURL: initialURL ?? path,
        },
      ).windowID;
    };

    registerEventListener("path", (path) => {
      console.log("pathEvent", path);
      const activeWindow = windows.value[windowID];
      if (activeWindow) {
        activeWindow.passedProps.initialURL = path;
        activeWindow.bringToFront();
      } else {
        createWindow(path);
      }
    });

    registerEventListener("bringToFront", () => {
      const activeWindow = windows.value[windowID];
      if (!activeWindow) createWindow();
    });

    // TODO: Implement this close message <3
    // Wait for explicit close message.
    return new Promise((resolve) => {
      registerEventListener("close", () => {
        resolve();
      });
    });
  },
};
