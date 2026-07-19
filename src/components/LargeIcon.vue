<script setup>
import "../assets/icons.scss";

defineProps({
  icon: {
    type: String,
    required: true,
  },
});

const baseURL = import.meta.env.BASE_URL;
</script>

<template>
  <i
    class="icon-64"
    :class="icon"
    :style="{ backgroundImage: `url('${baseURL}/img/icons-64.png')` }"
    ><slot
  /></i>
</template>
