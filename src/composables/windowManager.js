import { computed, markRaw, ref } from "vue";

const windows = ref({});
const focusOrder = ref([]);
const windowOrder = ref([]);
const hiddenWindows = ref(new Set());

export function useWindowManager() {
  const register = (id, name, component, options) => {
    const newID = crypto.randomUUID();
    windows.value[newID] = {
      id,
      name,
      component: markRaw(component),
      x: 50,
      y: 50,
      width: 300,
      height: 200,
      ...options,
    };

    focusOrder.value.push(newID);
    windowOrder.value.push(newID);
  };

  const bringToFront = (windowID) => {
    const index = focusOrder.value.indexOf(windowID);
    if (index < 0) {
      console.error("No window!");
    }

    const element = focusOrder.value.splice(index, 1);
    focusOrder.value.splice(focusOrder.value.length, 0, element[0]);
  };

  const move = (windowID, position) => {
    const window = windows.value[windowID];
    window.x = position.x;
    window.y = position.y;
  };

  const resize = (windowID, size) => {
    const window = windows.value[windowID];
    window.width = size.width;
    window.height = size.height;
  };

  const close = (windowID) => {
    delete windows.value[windowID];
    const focusIndex = focusOrder.value.indexOf(windowID);
    focusOrder.value.splice(focusIndex, 1);
    const orderIndex = windowOrder.value.indexOf(windowID);
    windowOrder.value.splice(orderIndex, 1);
  };

  const hide = (windowID) => {
    hiddenWindows.value.add(windowID);
  };

  const show = (windowID) => {
    hiddenWindows.value.delete(windowID);
    bringToFront(windowID);
  };

  const registerOrSwitch = (id, name, component, data) => {
    if (openWindowIDs.value.has(id)) {
      const [windowID] = Object.entries(windows.value).find(
        ([, window]) => window.id === id,
      );
      show(windowID);
      return;
    }

    register(id, name, component, data);
  };

  // Application IDs!
  const openWindowIDs = computed(() => {
    const idSet = new Set();
    Object.values(windows.value).map((window) => idSet.add(window.id));
    return idSet;
  });

  const changeTitle = (windowID, title) => {
    windows.value[windowID].title = title;
  };

  return {
    windows,
    windowOrder,
    focusOrder,
    hiddenWindows,
    openWindowIDs,
    register,
    bringToFront,
    registerOrSwitch,
    move,
    resize,
    close,
    hide,
    show,
    changeTitle,
  };
}
