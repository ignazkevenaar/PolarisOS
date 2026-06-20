<script setup>
import { useDraggable, useResizeObserver } from "@vueuse/core";
import { computed, inject, onMounted, useTemplateRef, watchEffect } from "vue";

const props = defineProps({
  width: {
    type: Number,
    default: 0,
  },
  height: {
    type: Number,
    default: 0,
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

const emit = defineEmits(["focus", "move", "resize", "close", "minimize"]);

const desktopElement = inject("desktopElement");
const windowElement = useTemplateRef("window");
const titleBarHandleElement = useTemplateRef("handle");

// `style` will be a helper computed for `left: ?px; top: ?px;`
const { x, y, style } = useDraggable(windowElement, {
  initialValue: { x: 40, y: 40 },
  handle: titleBarHandleElement,
  containerElement: desktopElement,
});

watchEffect(() => {
  emit("move", { x, y });
});

const myStyles = computed(() => ({
  width: `${props.width}px`,
  height: `${props.height}px`,
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
    :style="[style, myStyles]"
    class="window color-primary"
    :class="{ active, resizable, transparent, bevel: !transparent }"
    @mousedown="emit('focus')"
    @resize="test"
  >
    <div class="container" :class="{ emboss: !transparent }">
      <div class="titleBar">
        <button class="bevel" title="Close" @click="emit('close')">
          <span class="glyph bevel close"></span>
        </button>
        <div
          class="handle bevel text-shadow"
          :class="{ shift: !minimizable }"
          ref="handle"
        >
          {{ title }}
        </div>
        <button
          v-if="minimizable"
          class="bevel"
          title="Minimize"
          @click="emit('minimize')"
        >
          <span class="glyph bevel"></span>
        </button>
      </div>
      <div class="content" :class="{ 'color-surface': !transparent }">
        <slot :active></slot>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.window {
  --border-width: 2px;

  position: absolute;
  overflow: auto;
  min-width: 200px;
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

    .content {
      scrollbar-color: var(--color-tertiary-active-dark)
        rgb(var(--color-surface));
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
    height: 24px;
    margin-bottom: 2px;
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
      text-align: center;
      vertical-align: middle;
      line-height: 24px;

      &.shift {
        padding-inline-end: 24px; /* Space that would have been taken up by minimize button */
      }
    }

    button {
      appearance: none;
      font-family: inherit;
      aspect-ratio: 1;
      display: grid;
      place-items: center;

      &:active {
        border-left: var(--border-width) inset var(--window-color-dark);
        border-top: var(--border-width) inset var(--window-color-dark);
        border-right: var(--border-width) inset var(--window-color-light);
        border-bottom: var(--border-width) inset var(--window-color-light);
      }

      .glyph {
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
  }

  .content {
    display: grid;
    position: relative;
    flex: 1 1 auto;
    overflow: auto;
    scrollbar-color: rgb(var(--color-tertiary-inactive))
      rgb(var(--color-surface));
  }
}
</style>
