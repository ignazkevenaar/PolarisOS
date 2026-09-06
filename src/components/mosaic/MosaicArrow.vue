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
  width: 10px;
  height: 10px;

  &::after {
    display: block;
    position: absolute;
    top: 2px;
    left: 1.5px;
    border-top: 3px solid transparent;
    border-bottom: 3px solid transparent;
    border-left: 7px solid rgb(var(--local-color));
    width: 0;
    height: 0;
    content: "";
  }
}
</style>
