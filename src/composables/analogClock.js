import { ref, onMounted, onBeforeUnmount } from "vue";

export function useAnalogClock(withSeconds = false) {
  const hourAngle = ref(0);
  const minuteAngle = ref(0);
  const secondsAngle = ref(0);

  let interval;

  onMounted(() => {
    const setHandAngles = () => {
      const hours = new Date().getHours();
      const minutes = new Date().getMinutes();
      const seconds = new Date().getSeconds();

      hourAngle.value = ((hours % 12) / 12 + minutes / 60 / 12) * 360;
      minuteAngle.value = (minutes / 60 + seconds / 60 / 60) * 360;
      secondsAngle.value = seconds * 6;
    };
    setHandAngles();
    interval = window.setInterval(setHandAngles, withSeconds ? 100 : 5000);
  });

  onBeforeUnmount(() => {
    clearInterval(interval);
    interval = undefined;
  });

  return {
    hourAngle,
    minuteAngle,
    secondsAngle,
  };
}
