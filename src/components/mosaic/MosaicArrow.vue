<template>
  <div class="triangle"></div>
</template>

<style scoped>
.triangle {
  position: relative;
  flex: 0 0 auto;
  clip-path: polygon(0% 0%, 100% 50%, 0% 100%);
  background: linear-gradient(
    153deg,
    rgb(0 0 0 / 40%) 60%,
    rgb(255 255 255 / 60%) 60%
  );
  width: 12px;
  height: 12px;

  &::after {
    display: block;
    position: absolute;
    top: 2px;
    left: 1.5px;
    border-top: 4px solid transparent;
    border-bottom: 4px solid transparent;
    border-left: 8px solid rgb(var(--local-color));
    width: 0;
    height: 0;
    content: "";
  }
}
</style>
