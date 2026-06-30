<script setup>
import { ref } from "vue";
import IconContainer from "./IconContainer.vue";

defineProps({
  title: {
    type: String,
    default: "Untitled",
  },
  icon: {
    type: String,
    default: undefined,
  },
});

const pressed = ref(false);

const onMouseUp = () => {
  pressed.value = false;
  window.removeEventListener("mouseup", onMouseUp);
};

const onMouseDown = () => {
  pressed.value = true;

  window.addEventListener("mouseup", onMouseUp);
};
</script>

<template>
  <button
    class="color-surface"
    :class="[pressed ? 'emboss' : 'bevel']"
    @mousedown="onMouseDown"
  >
    <div :class="[pressed ? 'emboss' : 'bevel']">
      <span class="text-shadow">{{ title }}</span>
    </div>
    <div class="container" :class="[pressed ? 'emboss' : 'bevel']">
      <div class="emboss">
        <div class="iconContainer" :class="[pressed ? 'emboss' : 'bevel']">
          <IconContainer v-if="icon" :icon="icon" />
        </div>
      </div>
    </div>
  </button>
</template>

<style lang="css" scoped>
button {
  --border-width: 1px;
  --icon-shadow-depth: 2px;

  appearance: none;
  padding: 0;
  box-shadow: 4px 4px 0 rgb(0 0 0 / 0.25);
  font-family: inherit;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  user-select: none;

  > div {
    padding: 2px;
    overflow: hidden;
    display: flex;
  }

  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 0 0 auto;
    width: 100%;
  }

  .container {
    flex: 1 1 auto;
    justify-content: center;
    align-items: center;
  }

  .iconContainer {
    width: 72px;
    height: 72px;
    aspect-ratio: 1;
    display: grid;
    place-items: center;
    box-sizing: border-box;
  }
}
</style>
