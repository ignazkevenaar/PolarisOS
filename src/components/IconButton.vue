<script setup>
defineProps({
  text: {
    type: String,
    default: undefined,
  },
  icon: {
    type: String,
    default: undefined,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <button class="bevel interactive" :disabled>
    <slot></slot>
    <i v-if="icon" class="icon-16" :class="icon" />
    <span v-if="text">{{ text }}</span>
  </button>
</template>

<style lang="css" scoped>
button {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: inherit;
  padding: 4px 16px;
  font-size: 1em;
  outline: 1px solid color-mix(in oklch, var(--local-color-dark), black 50%);

  &:disabled > * {
    opacity: 0.5;
  }

  &:enabled:active > * {
    translate: 1px 1px;
  }
}

.icon-16 {
  margin: 4px;
}
</style>
