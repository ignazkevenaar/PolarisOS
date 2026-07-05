<script setup>
import LargeIcon from "../LargeIcon.vue";
import { useAnalogClock } from "../../composables/analogClock.js";

const { hourAngle, minuteAngle } = useAnalogClock();
</script>

<template>
  <LargeIcon icon="clock">
    <div class="face color-tertiary active">
      <img
        src="/img/hand-hour.png"
        class="hand hour"
        :style="{ rotate: `${hourAngle}deg` }"
      />
      <img
        src="/img/hand-minute.png"
        class="hand"
        :style="{ rotate: `${minuteAngle}deg` }"
      />
    </div>
  </LargeIcon>
</template>

<style lang="css" scoped>
.face {
  height: 100%;
  width: 100%;
  position: relative;
  filter: drop-shadow(0 2px 0 rgb(0 0 0 / 0.25));
}

.hand {
  position: absolute;
  inset: 0;
  image-rendering: pixelated;
}
</style>
