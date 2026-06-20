<script setup>
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
</script>

<template>
  <button class="color-secondary bevel active">
    <span class="text-shadow">{{ title }}</span>
    <div class="container emboss color-surface">
      <i v-if="icon" class="icon-64" :class="icon"></i>
    </div>
  </button>
</template>

<style lang="css" scoped>
button {
  appearance: none;
  padding: 2px;
  box-shadow: 4px 4px 0 rgb(0 0 0 / 0.25);
  font-family: inherit;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  user-select: none;

  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 2px;
  }

  .container {
    flex: 1;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 2px;
    justify-content: center;
    align-items: center;
  }
}
</style>
