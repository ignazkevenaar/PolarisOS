import { computed, markRaw, ref } from "vue";

const windows = ref({});
const windowOrder = ref([]);
const hiddenWindows = ref(new Set());
const minimizedWindowIDs = ref(new Set());
const focusedWindowID = ref(undefined);

// Opens every new window with a little offset so their titlebars don't overlap
// Every time you move a window from it's original position, it resets the global offset
const maxOffset = 400;
const tilingOffset = 40;
let tilingWindowCount = 0;

const incrementAndgetOffset = () => {
  tilingWindowCount++;

  return [
    Math.min(tilingWindowCount * tilingOffset, maxOffset),
    Math.min(tilingWindowCount * tilingOffset, maxOffset),
  ];
};

const maybeDecreaseTiling = (window) => {
  // Decrement this counter to allow new window to be opened at a lesser tiling level
  if (window.isAtOriginalPosition) {
    window.isAtOriginalPosition = false;
    tilingWindowCount = Math.max(tilingWindowCount - 1, 0);
  }
};

const focusLastWindow = () => {
  const lastWindowID = windowOrder.value.findLast((windowID) => {
    const window = windows.value[windowID];
    return !window.minimizedAt && !window.hiddenAt;
  });
  focusedWindowID.value = lastWindowID;
};

class Window {
  constructor(processID, component, options, parentWindowID) {
    this.processID = processID;
    this.component = component ? markRaw(component) : undefined;
    this.parentWindowID = parentWindowID;
    this.windowID = crypto.randomUUID();
    this.createdAt = new Date().getTime();
    const [x, y] = incrementAndgetOffset();
    this.x = x;
    this.y = y;
    this.isAtOriginalPosition = true;
    this.options = options; // TODO: ensure to handle these options
  }

  move(x, y) {
    maybeDecreaseTiling(window);
    this.x = x;
    this.y = y;
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
  }

  bringToFront(ignoreRelationships = false) {
    // Decide:
    // - What do do when windows are minimized?
    // - How to pass "disabled" or "overlaid" state to window itself.
    // - How to handle "modal" windows?
    // - How to handle "child" windows? Allow multiple windows to have focus at the same time?

    if (!ignoreRelationships) {
      // If you focus child window, bring up parent window first.
      if (this.parentWindowID)
        windows.value[this.parentWindowID].bringToFront(true);
    }

    const index = windowOrder.value.indexOf(this.windowID);
    if (index < 0) {
      console.error("No window!");
    }

    // show(windowID);
    const [element] = windowOrder.value.splice(index, 1);
    windowOrder.value.push(element);
    this.focus();

    // `Modal`
    // Blink window if modal?
    if (!ignoreRelationships) {
      // If you focus parent window with child window, focus that too.
      // This is slow, might want to keep a map of windowID => [childwindowIDs]
      Object.entries(windows.value)
        .filter(
          ([possibleWindowID, window]) =>
            window.parentWindowID === this.windowID &&
            !minimizedWindowIDs.value.has(possibleWindowID),
        )
        .map(([, childWindow]) => childWindow.bringToFront(true));
    }
  }

  focus() {
    focusedWindowID.value = this.windowID;
  }

  minimize() {
    this.getChildWindows(this.windowID).map(([, childWindow]) =>
      childWindow.hide(),
    );
    this.minimizedAt = new Date().getTime();
    minimizedWindowIDs.value.add(this.windowID);
    focusLastWindow();
  }

  hide() {
    this.hiddenAt = new Date().getTime();
    hiddenWindows.value.add(this.windowID);
    focusLastWindow();
  }

  show() {
    this.getChildWindows().map(([, childWindow]) => childWindow.show());
    delete this.hiddenAt;
    hiddenWindows.value.delete(this.windowID);
    delete this.minimizedAt;
    minimizedWindowIDs.value.delete(this.windowID);
    this.bringToFront();
  }

  close() {
    maybeDecreaseTiling(window);

    const focusIndex = windowOrder.value.indexOf(this.windowID);
    windowOrder.value.splice(focusIndex, 1);
    focusLastWindow();

    delete windows.value[this.windowID];
  }

  changeTitle(title) {
    this.title = title;
  }

  getChildWindows() {
    // Rather slow
    return Object.entries(windows.value).filter(
      ([, filterWindow]) => filterWindow.parentWindowID === this.windowID,
    );
  }
}

export function useWindowManager() {
  const registerWindow = (processID, options, parentWindowID) => {
    const window = new Window(processID, undefined, options, parentWindowID);
    windows.value[window.windowID] = window;

    windowOrder.value.push(window.windowID);
    window.bringToFront();

    return window;
  };

  const createWindow = (processID, component, options, parentWindowID) => {
    const window = new Window(processID, component, options, parentWindowID);
    windows.value[window.windowID] = window;

    windowOrder.value.push(window.windowID);
    window.bringToFront();

    return window;
  };

  const createOrSwitchToExistingWindow = (processID, component, data) => {
    if (processIDsWithOpenWindows.value.has(processID)) {
      // TODO: Slow
      const [, window] = Object.entries(windows.value).find(
        ([, window]) => window.processID === processID,
      );
      window.show();
      return window;
    }

    return createWindow(processID, component, data);
  };

  const processIDsWithOpenWindows = computed(() => {
    const idSet = new Set();
    Object.values(windows.value).map((window) => idSet.add(window.processID));
    return idSet;
  });

  const openWindowsPerProcessID = computed(() => {
    // [processID]: windowID[]
    const result = {};

    Object.entries(windows.value).map(([, window]) => {
      if (window.processID) (result[window.processID] ??= []).push(window);
    });

    return result;
  });

  const unfocusActiveWindow = () => {
    focusedWindowID.value = undefined;
  };

  return {
    Window,
    windows,
    windowOrder,
    hiddenWindows,
    minimizedWindowIDs,
    processIDsWithOpenWindows,
    registerWindow,
    createWindow,
    createOrSwitchToExistingWindow,
    openWindowsPerProcessID,
    focusedWindowID,
    unfocusActiveWindow,
  };
}
