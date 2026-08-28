<script setup>
import { useAnalogClock } from "../../composables/analogClock.js";

const { hourAngle, minuteAngle, secondsAngle } = useAnalogClock(true);
</script>
<template>
  <div class="container">
    <div class="clock">
      <div
        class="tick"
        v-for="tick in 60"
        :key="tick"
        :style="{ rotate: `${tick * 6}deg` }"
      ></div>

      <div class="hand hour" :style="{ rotate: `${hourAngle}deg` }">
        <div class="pointer"></div>
      </div>
      <div class="hand minute" :style="{ rotate: `${minuteAngle}deg` }">
        <div class="pointer"></div>
      </div>
      <div class="hand second" :style="{ rotate: `${secondsAngle}deg` }">
        <div class="pointer"></div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.container {
  display: grid;
  place-items: stretch;
  padding: 16px;
  overflow: hidden;
}

.clock {
  position: relative;

  .tick,
  .hand {
    position: absolute;
    translate: -50% 0;
    inset-block: 0;
    inset-inline-start: 50%;
  }

  .tick {
    border-top: 5px solid currentColor;
    width: 1px;

    &:nth-child(5n) {
      border-top-width: 10px;
    }
  }

  .hand {
    .pointer {
      position: relative;
      background-color: black;
      height: 50%;
    }
  }

  .hour .pointer {
    top: 20%;
    width: 3px;
    height: 30%;
  }

  .minute .pointer {
    top: 10%;
    width: 3px;
    height: 40%;
  }

  .second .pointer {
    width: 1px;
  }
}
</style>
