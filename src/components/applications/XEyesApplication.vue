<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";

const eyes = ref([]);
const pupilCoordinates = ref([
  {
    x: 0,
    y: 0,
  },
  {
    x: 0,
    y: 0,
  },
]);

const onMove = (e) => {
  eyes.value.forEach((eye, eyeIndex) => {
    const rect = eye.getBoundingClientRect();

    const borderWidth = 4;
    const a = rect.width / 2 - 16;
    const b = rect.height / 2 - 24;
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    let dx = e.clientX - rect.left - cx;
    let dy = e.clientY - rect.top - cy;

    const ratio = Math.sqrt((dx / a) ** 2 + (dy / b) ** 2);
    if (ratio > 1) {
      dx /= ratio;
      dy /= ratio;
    }

    pupilCoordinates.value[eyeIndex].x = cx + dx - 16 - borderWidth;
    pupilCoordinates.value[eyeIndex].y = cy + dy - 24 - borderWidth;
  });
};

onMounted(() => {
  window.addEventListener("mousemove", onMove);
});

onBeforeUnmount(() => {
  window.removeEventListener("mousemove", onMove);
});
</script>
<template>
  <div class="eyeContainer">
    <div class="eye" ref="eyes" v-for="i in 2" :key="i">
      <div
        class="pupil"
        :style="{
          left: `${pupilCoordinates[i - 1].x}px`,
          top: `${pupilCoordinates[i - 1].y}px`,
        }"
      ></div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.eyeContainer {
  display: flex;
}

.eye,
.pupil {
  border-radius: 100%;
}

.eye {
  position: relative;
  box-sizing: border-box;
  border: 4px solid black;
  background: white;
  width: 96px;
  height: 156px;
  overflow: hidden;

  .pupil {
    position: relative;
    background-color: black;
    width: 32px;
    height: 48px;
  }
}
</style>
