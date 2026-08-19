import { computed, markRaw, ref } from "vue";

const windows = ref({});
const windowOrder = ref([]);
const hiddenWindows = ref(new Set());
const minimizedWindows = ref(new Set());
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

export function useWindowManager() {
  const register = (processID, name, component, options, parentWindowID) => {
    const newWindowID = crypto.randomUUID();
    const [x, y] = incrementAndgetOffset();

    windows.value[newWindowID] = {
      processID,
      name,
      component: component ? markRaw(component) : undefined,
      x,
      y,
      isAtOriginalPosition: true,
      parent: undefined,
      ...options,
      parentWindowID,
      createdAt: new Date().getTime(), // Used for interlacing process and window items on dock.
    };

    windowOrder.value.push(newWindowID);

    return newWindowID;
  };

  const bringToFront = (windowID, ignoreRelationships = false) => {
    // Decide:
    // - What do do when windows are minimized?
    // - How to pass "disabled" or "overlaid" state to window itself.
    // - How to handle "modal" windows?
    // - How to handle "child" windows? Allow multiple windows to have focus at the same time?

    if (!ignoreRelationships) {
      // If you focus child window, bring up parent window first.
      const parentWindowID = windows.value[windowID].parentWindowID;
      if (parentWindowID) bringToFront(parentWindowID, true);
    }

    const index = windowOrder.value.indexOf(windowID);
    if (index < 0) {
      console.error("No window!");
    }

    // show(windowID);
    const element = windowOrder.value.splice(index, 1);
    windowOrder.value.splice(windowOrder.value.length, 0, element[0]);

    // `Modal`
    // Blink window if modal?
    if (!ignoreRelationships) {
      // If you focus parent window with child window, focus that too.
      // This is slow, might want to keep a map of windowID => [childwindowIDs]
      Object.entries(windows.value)
        .filter(
          ([possibleWindowID, window]) =>
            window.parentWindowID === windowID &&
            !minimizedWindows.value.has(possibleWindowID),
        )
        .map(([childWindowID]) => bringToFront(childWindowID, true));
    }
  };

  const move = (windowID, position) => {
    const window = windows.value[windowID];
    maybeDecreaseTiling(window);

    window.x = position.x;
    window.y = position.y;
  };

  const resize = (windowID, size) => {
    const window = windows.value[windowID];
    window.width = size.width;
    window.height = size.height;
  };

  const close = (windowID) => {
    const window = windows.value[windowID];
    maybeDecreaseTiling(window);

    delete windows.value[windowID];
    const focusIndex = windowOrder.value.indexOf(windowID);
    windowOrder.value.splice(focusIndex, 1);
  };

  const hide = (windowID) => {
    const window = windows.value[windowID];
    if (window) {
      window.hiddenAt = new Date().getTime();
      hiddenWindows.value.add(windowID);
    }
  };

  // Rather slow
  const getChildWindows = (windowID) =>
    Object.entries(windows.value).filter(
      ([, filterWindow]) => filterWindow.parentWindowID === windowID,
    );

  const minimize = (windowID) => {
    const window = windows.value[windowID];
    if (window) {
      getChildWindows(windowID).map(([childWindowID]) => hide(childWindowID));
      window.minimizedAt = new Date().getTime();
      minimizedWindows.value.add(windowID);
    }
  };

  const show = (windowID) => {
    const window = windows.value[windowID];
    if (window) {
      getChildWindows(windowID).map(([childWindowID]) => show(childWindowID));
      delete window.hiddenAt;
      hiddenWindows.value.delete(windowID);
      delete window.minimizedAt;
      minimizedWindows.value.delete(windowID);
      bringToFront(windowID);
    }
  };

  const focus = (windowID) => {
    const window = windows.value[windowID];
    if (window) {
      focusedWindowID.value = windowID;
    }
  };

  const registerOrSwitch = (processID, name, component, data) => {
    if (processIDsWithOpenWindows.value.has(processID)) {
      const [windowID] = Object.entries(windows.value).find(
        ([, window]) => window.processID === processID,
      );
      show(windowID);
      return windowID;
    }

    return register(processID, name, component, data);
  };

  const processIDsWithOpenWindows = computed(() => {
    const idSet = new Set();
    Object.values(windows.value).map((window) => idSet.add(window.processID));
    return idSet;
  });

  const openWindowsPerProcessID = computed(() => {
    // [processID]: windowID[]
    const result = {};

    Object.entries(windows.value).map(([windowID, window]) => {
      if (window.processID) (result[window.processID] ??= []).push(windowID);
    });

    return result;
  });

  const changeTitle = (windowID, title) => {
    windows.value[windowID].title = title;
  };

  return {
    windows,
    windowOrder,
    hiddenWindows,
    minimizedWindows,
    processIDsWithOpenWindows,
    register,
    bringToFront,
    registerOrSwitch,
    move,
    resize,
    close,
    hide,
    minimize,
    show,
    focus,
    changeTitle,
    openWindowsPerProcessID,
    focusedWindowID,
  };
}
