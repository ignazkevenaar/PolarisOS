<script setup>
import { computed, ref, watch } from "vue";
import { watchThrottled } from "@vueuse/core";
import { Window } from "../../composables/windowManager.js";
import eightBallResponses from "../../config/eightBallResponses.js";

const props = defineProps({
  window: {
    type: Window,
    required: true,
  },
});

const baseURL = import.meta.env.BASE_URL;

const response = ref("");

const generateResponse = () => {
  const randomIndex = Math.round(
    Math.random() * (eightBallResponses.length - 1),
  );
  response.value = eightBallResponses[randomIndex];
};

// Throttled watcher populates a list of old positions.
// Those list entries clear themselves with the inner timeout.
// We calculate the absolute average movement over all old positions.
// If that average is rising and higher than a magic number threshold,
// generate a new response!

const oldPositions = ref([]);
let windowShaken = false;

watchThrottled(
  () => [props.window.x, props.window.y],
  (position) => {
    oldPositions.value.push(position);
    // Difference between interval and timeout is max
    // amount of recorded positions to average.
    setTimeout(() => {
      oldPositions.value.shift();
    }, 550);
  },
  { throttle: 20 },
);

const averageMovement = computed(() => {
  if (oldPositions.value.length < 2) return 0;

  let average = 0;
  let previous = oldPositions.value[0];
  for (let i = 1; i < oldPositions.value.length; i++) {
    const current = oldPositions.value[i];
    average +=
      Math.abs(current[0] - previous[0]) + Math.abs(current[1] - previous[1]);
    previous = current;
  }

  return average / oldPositions.value.length;
});

watch(averageMovement, (movement, oldMovement) => {
  const threshold = 75;
  if (!windowShaken && movement >= threshold && movement > oldMovement) {
    windowShaken = true;
    generateResponse();
  } else if (movement < threshold && movement <= oldMovement) {
    windowShaken = false;
  }
});
</script>
<template>
  <div class="ball" @dblclick="generateResponse">
    <Transition name="fade" mode="out-in">
      <div
        v-if="response"
        :key="response"
        class="triangle double"
        :style="{
          backgroundImage: `url('${baseURL}/img/applications/eight-ball/triangle.png')`,
        }"
      >
        <span>{{ response }}</span>
      </div>
    </Transition>
    <img
      :src="`${baseURL}/img/applications/eight-ball/eight-ball.png`"
      class="double"
    />
  </div>
</template>

<style lang="css" scoped>
.ball {
  position: relative;
  overflow: hidden;
}

.fade-enter-active,
.fade-leave-active {
  --duration: 0.5s;
  --easing: steps(6);

  transition: background-position-x var(--duration) var(--easing);

  span {
    transition:
      scale var(--duration) var(--easing),
      color var(--duration) var(--easing),
      opacity var(--duration) var(--easing);
  }
}

.fade-enter-from,
.fade-leave-to {
  background-position-x: calc(-52px * 6);

  span {
    scale: 0;
    opacity: 0;
    color: #065ab5 !important;
  }
}

.triangle {
  display: grid;
  position: absolute;
  top: 39px;
  left: 39px;
  place-items: center;
  width: 52px;
  height: 45px;

  span {
    display: block;
    position: relative;
    top: -6px;
    align-content: center;
    width: min-content;
    min-width: 25px;
    color: white;
    font-size: 0.4rem;
    font-family: sans-serif;
    text-align: center;
    text-shadow: 1px 1px 1px #1d2b53;
  }
}

.double {
  zoom: 2;
}
</style>
