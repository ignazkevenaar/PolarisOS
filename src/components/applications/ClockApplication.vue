<script setup>
import ApplicationWindow from "../ApplicationWindow.vue";
import { useAnalogClock } from "../../composables/analogClock.js";

const { hourAngle, minuteAngle, secondsAngle } = useAnalogClock(true);
</script>
<template>
  <ApplicationWindow content-width="192" content-height="192">
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
  </ApplicationWindow>
</template>

<style lang="css" scoped>
.container {
  padding: 16px;
  display: grid;
  place-items: stretch;
  overflow: hidden;
}

.clock {
  position: relative;

  .tick,
  .hand {
    position: absolute;
    inset-inline-start: 50%;
    inset-block: 0;
    translate: -50% 0;
  }

  .tick {
    width: 1px;
    border-top: 5px solid currentColor;

    &:nth-child(5n) {
      border-top-width: 10px;
    }
  }

  .hand {
    .pointer {
      position: relative;
      height: 50%;
      background-color: black;
    }
  }

  .hour .pointer {
    width: 3px;
    top: 20%;
    height: 30%;
  }

  .minute .pointer {
    width: 3px;
    top: 10%;
    height: 40%;
  }

  .second .pointer {
    width: 1px;
  }
}
</style>
