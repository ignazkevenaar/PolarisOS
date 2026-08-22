import { ref, computed } from "vue";
import { useWindowManager } from "./windowManager";

const processes = ref({});
const processOrder = ref([]);

let applicationIndex = {};

const { windows, windowOrder, openWindowsPerProcessID, close, show } =
  useWindowManager();

export function useProcessManager() {
  const initializeApplications = async () => {
    console.log("initializing applications");

    // import.meta.glob MUST be a literal, no expressions.
    const manifests = import.meta.glob(
      "../manifests/applications/**/*.manifest.js",
    );

    const pathLeader = "../manifests/applications/";

    applicationIndex = Object.fromEntries(
      Object.entries(manifests).map(([path, getManifest]) => {
        const applicationID = path
          .split(pathLeader)[1]
          .split(".manifest.js")[0];
        return [applicationID, getManifest];
      }),
    );

    console.log(
      Object.keys(applicationIndex).length,
      "application(s) indexed",
      applicationIndex,
    );
  };

  const removeFromOrder = (processID) => {
    const processIndex = processOrder.value.indexOf(processID);
    processOrder.value.splice(processIndex, 1);
  };

  const createProcess = (applicationID, name, icon) => {
    const newID = crypto.randomUUID();
    processes.value[newID] = {
      applicationID,
      name: name ?? "untitled",
      icon: icon ?? "application",
      createdAt: new Date().getTime(),
      listeners: [], // Message listeners.
    };
    processOrder.value.push(newID);

    const doneCallback = (result) => {
      console.log(`Process ${newID} exited with result`, result);
      delete processes.value[newID];
    };

    console.log("Process started with id", newID);
    return [newID, doneCallback];
  };

  const startApplication = async (applicationID) => {
    // Check if application is already running
    const existingProcess = Object.entries(processes.value).find(
      ([, process]) => process.applicationID === applicationID,
    );

    if (existingProcess) {
      console.log(
        "Application already running",
        existingProcess[0],
        existingProcess[1],
      );
      // Send message to existing process...
      return [];
    }

    // Otherwise start new
    const getManifest = applicationIndex[applicationID];

    if (!getManifest) {
      console.error("Application", applicationID, "not found!");
      return [];
    }

    const manifest = (await getManifest()).default;

    // Bit strange, but this is a function that should be able to wait on two parts
    // So we have to return another promise here as an array if we want to wait on the application to close.
    return {
      done: new Promise((resolve) => {
        const [newProcessID, newProcessResult] = createProcess(applicationID);

        const registerMessageListener = (callback) => {
          processes.value[newProcessID].listeners.push(callback);
        };

        window.sendMessage = (message) => {
          processes.value[newProcessID].listeners.map((listener) => {
            listener(message);
          });
        };

        manifest.entry(newProcessID, registerMessageListener).then((result) => {
          newProcessResult(result);
          removeFromOrder(newProcessID);
          resolve();
        });

        manifest.reEntry(newProcessID);
      }),
    };
  };

  const stopProcess = (processID) => {
    openWindowsPerProcessID.value[processID].map((windowID) => close(windowID));
  };

  const activeProcess = computed(() => {
    const firstVisibleWindowID = windowOrder.value.findLast((windowID) => {
      const window = windows.value[windowID];
      return !window.hiddenAt && !window.minimizedAt;
    });

    if (!firstVisibleWindowID) return undefined;

    return processes.value[windows.value[firstVisibleWindowID].processID];
  });

  const bringProcessToFront = (processID) => {
    removeFromOrder(processID);
    processOrder.value.push(processID);

    const sortedWindowsForApplication = Object.entries(windows.value)
      .filter(([, window]) => window.processID === processID)
      .sort((a, b) => {
        if ((a.minimizedAt ?? a.createdAt) > (b.minimizedAt ?? b.createdAt)) {
          return 1;
        }
        if ((a.minimizedAt ?? a.createdAt) < (b.minimizedAt ?? b.createdAt)) {
          return -1;
        }
        return 0;
      });

    // TODO every is true for empty collections
    const allWindowsMinimized = sortedWindowsForApplication.every(
      ([, window]) => window.minimizedAt > 0,
    );

    if (sortedWindowsForApplication.length > 0 && allWindowsMinimized) {
      // TODO every is true for empty collections
      sortedWindowsForApplication.at(-1)[1].show();
    } else {
      const windowIDswindowOrder = windowOrder.value.filter((windowID) => {
        const window = windows.value[windowID];
        return window.processID === processID;
      });

      windowIDswindowOrder.forEach((windowID) => {
        const window = windows.value[windowID];
        if (!window.minimizedAt && !window.hiddenAt) {
          windows.value[windowID].show();
        }
      });
    }
  };

  return {
    initializeApplications,
    createProcess,
    startApplication,
    stopProcess,
    processes,
    activeProcess,
    bringProcessToFront,
    processOrder,
  };
}
