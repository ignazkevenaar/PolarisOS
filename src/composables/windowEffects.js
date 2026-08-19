import { onMounted, ref } from "vue";

export function useWindowEffects(windowContentElement) {
  const prefersReducedMotion = ref(false);
  const lowestZIndex = ref(false);
  const showingDesktopColor = ref(false);

  const allDescendants = (node, fn, depth = 1) => {
    for (const [i, child] of node.childNodes.entries()) {
      allDescendants(child, fn, depth + 1);
      fn(child, depth, i);
    }
  };

  const hideNode = (node) => {
    if (node.style) {
      // We use opacity instead of visibility because
      // it allows for user interaction on minimize and close button.
      //
      // Otherwise, by the time you click those buttons the window focuses
      // and the repainting behavior hides the button, never actually firing the click event.
      node.style.opacity = 0;
    }
  };

  const showNode = async (node, depth, index) => {
    const e = Math.pow(Math.random(), 20);
    const t = index * 10 + e * 30 + 50 * depth;
    return new Promise((resolve) =>
      setTimeout(() => {
        if (node.style) {
          node.style.opacity = null;
        }
        resolve();
      }, t),
    );
  };

  const repaintWindow = async () => {
    if (prefersReducedMotion.value) return;

    lowestZIndex.value = false;
    showingDesktopColor.value = false;

    allDescendants(windowContentElement.value, hideNode);
    allDescendants(windowContentElement.value, showNode);
  };

  const wait = async (ms) => {
    await new Promise((resolve) => setTimeout(resolve, ms));
  };

  const paintDesktopColor = async () => {
    if (prefersReducedMotion.value) return;
    await wait(50);
    lowestZIndex.value = true;
    await wait(75);
    showingDesktopColor.value = true;
    await wait(200);
  };

  onMounted(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    mediaQuery.addEventListener("change", () => {
      prefersReducedMotion.value = mediaQuery.matches;
    });
    prefersReducedMotion.value = mediaQuery.matches;
  });

  return {
    prefersReducedMotion,
    repaintWindow,
    paintDesktopColor,
    lowestZIndex,
    showingDesktopColor,
  };
}
