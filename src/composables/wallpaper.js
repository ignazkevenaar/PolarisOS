import { computed } from "vue";
import { useSettings } from "../composables/settings.js";

export function useWallpaper() {
  const { settings } = useSettings();

  const isCustomWallpaper = computed(() =>
    settings.value.wallpaper?.startsWith("data:image"),
  );

  const wallpaperStyles = computed(() => {
    if (!settings.value.wallpaper) {
      return {
        backgroundColor: "rgb(var(--color-desktop))",
      };
    }

    let size, repeat;

    const wSize = settings.value.wallpaperSize;
    if (wSize === "original") {
      size = "auto";
      repeat = "no-repeat";
    } else if (wSize === "stretch") {
      size = "100% 100%";
    } else if (wSize === "fit") {
      size = "contain";
      repeat = "no-repeat";
    } else if (wSize === "fill") {
      size = "cover";
    }

    const baseURL = import.meta.env.BASE_URL;
    const url = isCustomWallpaper.value
      ? settings.value.wallpaper
      : `${baseURL}img/wallpapers/${settings.value.wallpaper}`;

    return {
      backgroundColor: "rgb(var(--color-desktop))",
      backgroundImage: `url('${url}')`,
      backgroundPosition: "center",
      backgroundRepeat: repeat,
      backgroundSize: size,
    };
  });

  return {
    wallpaperStyles,
    isCustomWallpaper,
  };
}
