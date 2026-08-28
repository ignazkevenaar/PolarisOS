import { ref, computed, toValue, toRaw } from "vue";
import { useWindowManager } from "./windowManager";

const processes = ref({});
const processOrder = ref([]);

let applicationIndex = ref({});

const {
  windows,
  windowOrder,
  openWindowsPerProcessID,
  unfocusActiveWindow,
  createWindow,
  focusedWindowID,
} = useWindowManager();

class Process {
  constructor(applicationID, name, icon) {
    this.processID = crypto.randomUUID();
    this.createdAt = new Date().getTime();
    this.applicationID = applicationID;
    this.name = name ?? "untitled";
    this.icon = icon ?? "application";
    this.eventHandlers = {};

    this.windows = computed(() =>
      Object.fromEntries(
        Object.entries(windows.value).filter(
          ([, window]) => window.processID === this.processID,
        ),
      ),
    );
  }

  stop() {
    openWindowsPerProcessID.value[this.processID]?.map((window) =>
      window.close(),
    );
  }

  bringToFront() {
    unfocusActiveWindow();
    const processIndex = processOrder.value.indexOf(this.processID);
    processOrder.value.splice(processIndex, 1);
    processOrder.value.push(this.processID);
  }

  bringWindowsToFront() {
    this.bringToFront();

    const sortedProcessWindows = Object.entries(toValue(this.windows)).sort(
      (a, b) => {
        if ((a.minimizedAt ?? a.createdAt) > (b.minimizedAt ?? b.createdAt)) {
          return 1;
        }
        if ((a.minimizedAt ?? a.createdAt) < (b.minimizedAt ?? b.createdAt)) {
          return -1;
        }
        return 0;
      },
    );

    // TODO every is true for empty collections
    const allWindowsMinimized = sortedProcessWindows.every(
      ([, window]) => window.minimizedAt > 0,
    );

    if (sortedProcessWindows.length > 0 && allWindowsMinimized) {
      sortedProcessWindows.at(-1)[1].show();
    } else {
      // Clone because bringToFront modifies collection.
      structuredClone(toRaw(windowOrder.value)).map((windowID) => {
        const window = windows.value[windowID];
        if (
          window.processID === this.processID &&
          !window.minimizedAt &&
          !window.hiddenAt
        ) {
          window.bringToFront();
        }
      });
    }
  }

  registerEventListener(type, handler) {
    this.eventHandlers[type] = handler;
  }

  dispatchEvent(type, args) {
    this.eventHandlers[type]?.(args);
  }

  createWindow(component, options) {
    return createWindow(this.processID, component, options);
  }
}

export function useProcessManager() {
  const initializeApplications = async () => {
    console.log("initializing applications");

    // import.meta.glob MUST be a literal, no expressions.
    const manifests = import.meta.glob(
      "../manifests/applications/**/*.manifest.js",
    );

    const pathLeader = "../manifests/applications/";

    applicationIndex.value = Object.fromEntries(
      Object.entries(manifests).map(([path, getManifest]) => {
        const applicationID = path
          .split(pathLeader)[1]
          .split(".manifest.js")[0];
        return [applicationID, getManifest];
      }),
    );

    console.log(
      Object.keys(applicationIndex.value).length,
      "application(s) indexed",
      applicationIndex.value,
    );
  };

  const createProcess = (applicationID, name, icon) => {
    const process = new Process(applicationID, name, icon);

    const doneCallback = (result) => {
      console.log(`Process ${process.processID} exited with result`, result);
      delete processes.value[process.processID];
    };

    processes.value[process.processID] = process;
    console.log("Process started with id", process.processID);
    return [process, doneCallback];
  };

  const startApplication = async (applicationID, path) => {
    // Check if application is already running
    const maybeProcess = Object.entries(processes.value).find(
      ([, process]) => process.applicationID === applicationID,
    );

    if (maybeProcess) {
      const [, process] = maybeProcess;
      // console.warn("Application already running", processID, process);
      process.bringWindowsToFront();

      // Did path change?
      if (path !== process.path && path !== undefined) {
        console.log("Path changed", process.path, "->", path);
        process.dispatchEvent("path", path);
      }

      return;
    }

    // Otherwise start new
    const getManifest = applicationIndex.value[applicationID];

    if (!getManifest) {
      console.error("Application", applicationID, "not found!");
      return;
    }

    const manifest = (await getManifest()).default;

    // Bit strange, but this is a function that should be able to wait on two parts
    // So we have to return another promise here as an array if we want to wait on the application to close.
    return {
      done: new Promise((resolve) => {
        const [newProcess, newProcessResult] = createProcess(
          applicationID,
          manifest.name,
          manifest.icon,
        );

        const args = {
          process: newProcess,
          registerEventListener: (name, handler) =>
            newProcess.registerEventListener(name, handler),
        };

        manifest.entry(args).then((result) => {
          newProcessResult(result);
          newProcess.stop();
          resolve();
        });
        processOrder.value.push(newProcess.processID);
        newProcess.dispatchEvent("path", path);
        newProcess.bringWindowsToFront();
      }),
    };
  };

  const activeProcessID = computed(
    () =>
      windows.value[focusedWindowID.value]?.processID ??
      processOrder.value.at(-1),
  );

  return {
    Process,
    initializeApplications,
    createProcess,
    startApplication,
    processes,
    activeProcessID,
    applicationIndex,
  };
}
