<script setup>
const model = defineModel({ type: String });

defineProps({
  options: {
    type: Array,
    default: undefined,
  },
});
</script>

<template>
  <label>
    <select v-model="model">
      <option
        v-for="option in options"
        :key="option.value ?? option"
        :value="option.value"
      >
        {{ option.text ?? option }}
      </option>
    </select>
    <div class="background">
      <div class="fill bevel"></div>
      <div class="arrows bevel"></div>
      <!-- Lo-fi way of doing it... -->
      <div class="fill emboss"></div>
      <div class="arrows emboss"></div>
    </div>
  </label>
</template>

<style lang="css" scoped>
label {
  position: relative;
}

select {
  position: relative;
  appearance: none;
  z-index: 1;
  outline: none;
  border: none;
  background-color: transparent;
  padding: 4px 6px;
  padding-inline-end: 24px; /* .arrows width */
  width: 100%;
  font-size: 1rem;
  font-family: inherit;

  &:open + .background .bevel {
    display: none;
  }

  &:not(:open) + .background .emboss {
    display: none;
  }

  &:open,
  &:focus {
    + .background::before {
      --border-offset: 2px;
      display: block;
      position: absolute;
      inset: calc(-1 * var(--border-offset));
      border: var(--border-offset) solid rgb(var(--color-tertiary-active));
      border-radius: calc(var(--radius) + var(--border-offset));
      background-color: transparent;

      content: "";
    }
  }
}

.background {
  --radius: 4px;
  --border-offset: 1px;
  display: flex;

  position: absolute;
  z-index: 0;
  inset: 0;
  border: var(--border-offset) solid black;
  border-radius: calc(var(--radius) + var(--border-offset));

  .fill {
    flex: 1 1 auto;
    border-inline-end-width: 1px;
    border-start-start-radius: var(--radius);
    border-end-start-radius: var(--radius);
  }

  .arrows {
    border-inline-start-width: 1px;
    border-start-end-radius: var(--radius);
    border-end-end-radius: var(--radius);
  }
}

.arrows {
  --arrow-size: 3px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;

  padding: 2px 6px;
  pointer-events: none;

  &::before,
  &::after {
    display: block;
    filter: drop-shadow(0 1px 0 var(--local-color-light));
    border-right: var(--arrow-size) solid transparent;
    border-left: var(--arrow-size) solid transparent;
    width: 0;
    height: 0;
    content: "";
  }

  &::before {
    border-bottom: calc(var(--arrow-size) * 2) solid currentColor;
  }

  &::after {
    border-top: calc(var(--arrow-size) * 2) solid currentColor;
  }
}
</style>
