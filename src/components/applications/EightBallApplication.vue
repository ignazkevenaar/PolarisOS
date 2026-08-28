<script setup>
import { ref, watch, toValue } from "vue";
import eightBallResponses from "../../config/eightBallResponses.js";

const baseURL = import.meta.env.BASE_URL;

const response = ref("");

const generateResponse = () => {
  const randomIndex = Math.round(
    Math.random() * (eightBallResponses.length - 1),
  );
  response.value = eightBallResponses[randomIndex];
};

const windowShaken = ref(false);
let dragDeltaToBeAdded = 0;
let lastPosition;
let dragDeltaInterval;
const dragAcceleration = ref(0);
watch(dragAcceleration, (newAmount, oldAmount) => {
  if (!windowShaken.value && newAmount > oldAmount && newAmount >= 600) {
    windowShaken.value = true;
    generateResponse();
  }

  if (dragDeltaInterval && newAmount === 0) {
    clearInterval(dragDeltaInterval);
    dragDeltaInterval = undefined;
    windowShaken.value = false;
  }
});

const onDragStart = (position) => {
  dragAcceleration.value = 0;
  dragDeltaToBeAdded = 0;
  lastPosition = toValue(position);
  windowShaken.value = false;

  dragDeltaInterval = setInterval(() => {
    let newAmount = dragAcceleration.value + dragDeltaToBeAdded - 25;
    newAmount = Math.max(newAmount, 0);
    dragAcceleration.value = newAmount;
    dragDeltaToBeAdded = 0;
  }, 10);
};

const onDragMove = (position) => {
  const rawPosition = toValue(position);

  const delta =
    Math.abs(rawPosition.x - lastPosition.x) +
    Math.abs(rawPosition.y - lastPosition.y);
  dragDeltaToBeAdded = delta;
  lastPosition = toValue(position);
};

const onDragEnd = () => {
  lastPosition = undefined;
};
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
