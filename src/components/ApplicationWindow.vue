<script setup>
import { computed, inject, onMounted, useTemplateRef } from "vue";
import { useDraggable, useResizeObserver } from "@vueuse/core";

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
  minimizable: {
    type: Boolean,
    default: true,
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

const desktopElement = inject("desktopElement");
const windowElement = useTemplateRef("window");
const titleBarHandleElement = useTemplateRef("handle");

// `style` will be a helper computed for `left: ?px; top: ?px;`
const { style } = useDraggable(windowElement, {
  initialValue: { x: props.x, y: props.y },
  handle: titleBarHandleElement,
  containerElement: desktopElement,
  onStart: (position, event) => emit("dragStart", position, event),
  onMove: (position, event) => emit("dragMove", position, event),
  onEnd: (position, event) => emit("dragEnd", position, event),
});

const windowStyles = computed(() => ({
  width: isNaN(props.width) ? props.width : `${props.width}px`,
  height: isNaN(props.height) ? props.height : `${props.height}px`,
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
});
</script>

<template>
  <div
    ref="window"
    :style="[style, windowStyles]"
    class="window color-primary"
    :class="{ active, resizable, transparent, bevel: !transparent }"
    @mousedown="emit('focus')"
    @resize="test"
  >
    <div class="container" :class="{ emboss: !transparent }">
      <div class="titleBar">
        <button class="bevel interactive" title="Close" @click="emit('close')">
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
          @click="emit('minimize')"
        >
          <span class="glyph bevel"></span>
        </button>
      </div>
      <slot name="toolbar" :active></slot>
      <div
        class="content"
        :class="transparent ? [] : ['color-surface', 'bevel']"
        :style="contentStyles"
      >
        <slot :active></slot>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.window {
  display: grid;
  position: absolute;
  overflow: auto;
  min-width: 150px;
  min-height: 150px;
  user-select: none;

  &:not(.transparent) {
    padding: 2px;
    box-shadow:
      2px 2px 0px black,
      4px 4px 0px rgba(0 0 0 / 0.25);
  }

  &.transparent {
    background-color: transparent;
  }

  &.active {
    &:not(.transparent) {
      box-shadow:
        2px 2px 0px black,
        12px 12px 0px rgba(0 0 0 / 0.15);
    }
  }

  &.resizable {
    resize: both;
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
</style>
