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
  appearance: none;
  padding: 4px 6px;
  width: 100%;
  background-color: transparent;
  border: none;
  position: relative;
  z-index: 1;
  padding-inline-end: 24px; /* .arrows width */
  outline: none;
  font-family: inherit;
  font-size: 1rem;

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

      content: "";
      display: block;
      position: absolute;
      inset: calc(-1 * var(--border-offset));
      background-color: transparent;
      border-radius: calc(var(--radius) + var(--border-offset));
      border: var(--border-offset) solid rgb(var(--color-tertiary-active));
    }
  }
}

.background {
  --radius: 4px;
  --border-offset: 1px;

  position: absolute;
  inset: 0;
  display: flex;
  z-index: 0;
  border: var(--border-offset) solid black;
  border-radius: calc(var(--radius) + var(--border-offset));

  .fill {
    flex: 1 1 auto;
    border-start-start-radius: var(--radius);
    border-end-start-radius: var(--radius);
    border-inline-end-width: 1px;
  }

  .arrows {
    border-start-end-radius: var(--radius);
    border-end-end-radius: var(--radius);
    border-inline-start-width: 1px;
  }
}

.arrows {
  --arrow-size: 3px;

  padding: 2px 6px;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;

  &::before,
  &::after {
    content: "";
    display: block;
    width: 0;
    height: 0;
    border-left: var(--arrow-size) solid transparent;
    border-right: var(--arrow-size) solid transparent;
    filter: drop-shadow(0 1px 0 var(--local-color-light));
  }

  &::before {
    border-bottom: calc(var(--arrow-size) * 2) solid currentColor;
  }

  &::after {
    border-top: calc(var(--arrow-size) * 2) solid currentColor;
  }
}
</style>
