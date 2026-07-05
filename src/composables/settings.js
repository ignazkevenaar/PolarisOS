import { ref } from "vue";
import themes from "../config/themes.js";
import fonts from "../config/fonts.js";

const defaultSettings = {
  theme: Object.keys(themes)[0],
  font: Object.keys(fonts)[0],
  wallpaperSize: "tile",
};

const isObject = (item) => {
  return item && typeof item === "object" && !Array.isArray(item);
};
const mergeDeep = (target, ...sources) => {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
};

const settings = ref(undefined);
const storageKey = "polaris-settings";

const tryWritingToLocalStorage = (contents) => {
  try {
    localStorage.setItem(storageKey, contents);
  } catch (error) {
    console.error("Error writing settings to localStorage", error);
  }
};

export function useSettings() {
  if (settings.value === undefined) {
    try {
      const results = localStorage.getItem(storageKey);

      try {
        if (results === null) throw new Error("Settings are null");

        const json = JSON.parse(results);
        const newSettings = {};
        mergeDeep(newSettings, structuredClone(defaultSettings), json);
        settings.value = newSettings;
      } catch (error) {
        console.error("No or invalid settings", error);
        settings.value = structuredClone(defaultSettings);
      }
    } catch (error) {
      console.error("Error getting settings", error);
    }
  }

  const setSetting = (key, value) => {
    settings.value[key] = value;
    const jsonString = JSON.stringify(settings.value);
    tryWritingToLocalStorage(jsonString);
  };

  const resetSettings = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error("Error clearing settings", error);
    }
  };

  return {
    settings,
    setSetting,
    resetSettings,
  };
}
