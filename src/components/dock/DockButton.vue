<script setup>
defineProps({
  title: {
    type: String,
    default: undefined,
  },
  tooltip: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <div class="button color-surface">
    <div class="background bevel"></div>
    <div class="title" v-if="title">{{ title }}</div>
    <div class="iconContainer">
      <slot></slot>
    </div>
    <div v-if="tooltip" class="tooltip bevel color-secondary text-shadow">
      {{ tooltip }}
    </div>
  </div>
</template>

<style lang="css" scoped>
.button {
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  aspect-ratio: 1;
  width: 84px;
  height: 84px;

  &:hover {
    .tooltip {
      display: block;
      position: absolute;
      inset-block-end: 125%;
      width: max-content;
      max-width: 200px;
    }
  }

  &:active {
    .background {
      background: linear-gradient(
        to bottom right,
        var(--local-color-dark),
        rgb(var(--local-color))
      );
    }

    .iconContainer {
      filter: brightness(0.75);
    }
  }

  .background {
    position: absolute;
    z-index: -1;
    inset: 0;
    background: linear-gradient(
      to bottom right,
      rgb(var(--local-color)),
      var(--local-color-dark)
    );
  }

  .title {
    --border-width: 1px;
    align-self: stretch;
    border-top: var(--border-width) solid #aaa;
    border-left: var(--border-width) solid #aaa;
    background-color: black;
    padding-inline: 2px;
    height: 12px;
    overflow: hidden;
    color: white;
    font-size: 7pt;
    line-height: 12px;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .iconContainer {
    display: grid;
    position: relative;
    flex: 1;
    place-items: center;
    width: 100%;
    height: 100%;
  }

  .tooltip {
    display: none;
    box-shadow: 2px 2px 0 rgb(0 0 0 / 0.2);
    padding: 4px 8px;
    text-align: center;
  }
}
</style>
