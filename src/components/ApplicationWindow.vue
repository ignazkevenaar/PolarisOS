<script setup>
import { ref, computed, watch, inject, onMounted, useTemplateRef } from "vue";
import { useDraggable, useResizeObserver } from "@vueuse/core";
import { useWindowEffects } from "../composables/windowEffects";

const props = defineProps({
  x: {
    type: Number,
    default: 0,
  },
  y: {
    type: Number,
    default: 0,
  },
  width: {
    type: [Number, String],
    default: "auto",
  },
  height: {
    type: [Number, String],
    default: "auto",
  },
  contentWidth: {
    type: [Number, String],
    default: "auto",
  },
  contentHeight: {
    type: [Number, String],
    default: "auto",
  },
  center: {
    type: Boolean,
    default: false,
  },
  zIndex: {
    type: Number,
    default: undefined,
  },
  active: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: "Untitled",
  },
  resizable: {
    type: Boolean,
    default: false,
  },
  transparent: {
    type: Boolean,
    default: false,
  },
  closable: {
    type: Boolean,
    default: true,
  },
  minimizable: {
    type: Boolean,
    default: true,
  },
  dragDirectly: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  "focus",
  "resize",
  "close",
  "minimize",
  "dragStart",
  "dragMove",
  "dragEnd",
]);

const {
  prefersReducedMotion,
  lowestZIndex,
  repaintWindow,
  paintDesktopColor,
  showingDesktopColor,
} = useWindowEffects(useTemplateRef("windowContent"));

const desktopElement = inject("desktopElement");
const windowElement = useTemplateRef("window");
const titleBarHandleElement = useTemplateRef("handle");
const dragDirectly = computed(
  () => prefersReducedMotion.value || props.dragDirectly,
);
let initialDragPosition = undefined;
const dragging = ref(false);

// `style` will be a helper computed for `left: ?px; top: ?px;`
const { style } = useDraggable(windowElement, {
  initialValue: { x: props.x, y: props.y },
  handle: titleBarHandleElement,
  containerElement: desktopElement,
  onStart: (position, event) => {
    emit("dragStart", position, event);
  },
  onMove: (position, event) => {
    if (!initialDragPosition) initialDragPosition = position;
    else if (!dragDirectly.value) {
      if (!dragging.value) {
        const threshold = 10;
        const delta =
          Math.abs(position.x - initialDragPosition.x) +
          Math.abs(position.y - initialDragPosition.y);
        if (delta > threshold) dragging.value = true;
      }
    } else emit("dragMove", position, event);
  },
  onEnd: async (position, event) => {
    if (dragDirectly.value) {
      emit("dragEnd", position, event);
      return;
    }
    if (dragging.value) {
      await paintDesktopColor();
      initialDragPosition = undefined;
      dragging.value = false;
      repaintWindow();
    }
    emit("dragEnd", position, event);
  },
});

const maybeConvertStyleToPX = (val) => (isNaN(val) ? val : `${val}px`);

const getActualWindowDimensions = () => {
  const rect = windowElement.value.getBoundingClientRect();
  return {
    width: `${rect.width}px`,
    height: `${rect.height}px`,
  };
};

const windowStyles = computed(() => ({
  left: maybeConvertStyleToPX(props.x),
  top: maybeConvertStyleToPX(props.y),
  width: maybeConvertStyleToPX(props.width),
  height: maybeConvertStyleToPX(props.height),
  zIndex: lowestZIndex.value ? -100 : props.zIndex,
}));

const contentStyles = computed(() => ({
  width: isNaN(props.contentWidth)
    ? props.contentWidth
    : `${props.contentWidth}px`,
  height: isNaN(props.contentHeight)
    ? props.contentHeight
    : `${props.contentHeight}px`,
}));

onMounted(() => {
  if (props.resizable) {
    useResizeObserver(windowElement, (entries) => {
      if (!entries[0].target.checkVisibility()) return; // Don't set width when element is not visible.
      const entry = entries[0];
      const { width, height } = entry.contentRect;
      emit("resize", { width, height });
    });
  }

  if (props.center) {
    const { width: wW, height: wH } =
      windowElement.value.getBoundingClientRect();
    const { width: dW, height: dH } =
      desktopElement.value.getBoundingClientRect();

    emit("dragMove", { x: (dW - wW) / 2, y: (dH - wH) / 2 });
  }

  watch(
    () => [props.zIndex, props.active],
    ([newZ, newActive], oldValues) => {
      if (oldValues === undefined) {
        repaintWindow();
        return;
      }
      const [oldZ] = oldValues;
      if ((newZ && newZ > oldZ) || newActive) repaintWindow();
    },
    { immediate: true },
  );
});

const onClose = async () => {
  await paintDesktopColor();
  emit("close");
};

const onMinimize = async () => {
  await paintDesktopColor();
  emit("minimize");
};
</script>

<template>
  <div
    ref="window"
    :style="[windowStyles]"
    @pointerdown="emit('focus')"
    class="windowWrapper"
    :class="{
      active,
      resizable,
      transparent,
      desktopColor: showingDesktopColor,
      shadow: !showingDesktopColor,
    }"
  >
    <div
      class="window color-primary"
      :class="{
        active,
        bevel: !transparent,
      }"
    >
      <div class="container" :class="{ emboss: !transparent }">
        <div class="titleBar">
          <button
            v-if="closable"
            class="bevel interactive"
            title="Close"
            @click="onClose"
          >
            <span class="glyph bevel close"></span>
          </button>
          <div class="handle bevel text-shadow" ref="handle">
            {{ title }}
            <div v-if="!minimizable" class="spacer"></div>
          </div>
          <button
            v-if="minimizable"
            class="bevel interactive"
            title="Minimize"
            @click="onMinimize"
          >
            <span class="glyph bevel"></span>
          </button>
        </div>
        <slot name="toolbar" :active></slot>
        <div
          ref="windowContent"
          class="content"
          :class="transparent ? [] : ['color-surface', 'bevel']"
          :style="contentStyles"
        >
          <slot :active :close="onClose"></slot>
        </div>
      </div>
    </div>

    <!-- This element is a border that's shown as a target where you're about to drag the window to.
    From the before-times before we had fast enough PCs or compositing window managers... :-) -->
    <Teleport :to="desktopElement">
      <div
        v-if="dragging"
        class="dragShadow"
        :style="[style, getActualWindowDimensions()]"
      ></div>
    </Teleport>
  </div>
</template>

<style lang="css" scoped>
@property --wipe-percentage {
  syntax: "<percentage>";
  initial-value: 0%;
  inherits: false;
}

@keyframes wipe {
  from {
    --wipe-percentage: 0%;
  }
  to {
    --wipe-percentage: 100%;
  }
}

.windowWrapper {
  position: absolute;
  min-width: 150px;
  min-height: 150px;
  display: grid;

  &.resizable {
    resize: both;
    overflow: hidden;
  }

  &.shadow:not(.transparent) {
    box-shadow:
      2px 2px 0px black,
      4px 4px 0px rgba(0 0 0 / 0.25);
  }

  &.active {
    &.shadow:not(.transparent) {
      box-shadow:
        2px 2px 0px black,
        12px 12px 0px rgba(0 0 0 / 0.15);
    }
  }

  &.desktopColor {
    background-color: rgb(var(--color-desktop));

    .window {
      mask-image: linear-gradient(
        to bottom,
        transparent var(--wipe-percentage),
        black var(--wipe-percentage)
      );
      animation: 0.1s wipe both steps(8);
    }
  }
}

.window {
  display: grid;
  overflow: hidden;
  user-select: none;
  height: 100%;
  padding: 2px;
  box-sizing: border-box;

  &.transparent {
    background-color: transparent;
  }

  .container {
    text-rendering: geometricPrecision;
    box-sizing: border-box;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .transparent & {
      background-color: transparent;
    }
  }

  .titleBar {
    --border-width: 1px;

    flex: 0 0 auto;
    min-height: 18px;
    display: flex;
    box-shadow:
      0 1px 0 rgb(0 0 0 / 0.15),
      0 2px 0 rgb(0 0 0 / 0.15);

    .handle {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;
      vertical-align: middle;
      display: flex;
      justify-content: center;
      align-items: center;

      .spacer {
        aspect-ratio: 1;
        height: 100%;
        flex: 0 1 auto;
      }
    }

    button {
      appearance: none;
      font-family: inherit;
      aspect-ratio: 1;
      display: grid;
      place-items: center;

      .glyph {
        --border-width: 1px;
        display: block;
        width: 12px;
        height: 2px;
        box-shadow: 1px 1px 0 rgb(0 0 0 / 0.1);

        &.close {
          width: 10px;
          height: 10px;
        }
      }
    }

    .transparent & {
      --border-width: revert;
    }
  }

  .content {
    display: grid;
    position: relative;
    flex: 1 1 auto;
    overflow: auto;
  }
}

.dragShadow {
  position: absolute;
  box-sizing: border-box;
  z-index: 100;
  pointer-events: none;
  /* Terrible way to create an inverted border... */
  &::before,
  &::after {
    content: "";
    display: block;
    position: absolute;
    inset: 0;
    backdrop-filter: invert(1);
  }

  &::after {
    inset: 4px;
  }
}
</style>
