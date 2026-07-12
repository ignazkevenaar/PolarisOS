<script setup>
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
    class="icon-16"
    :class="icon"
    :style="{ backgroundImage: `url('${baseURL}/img/icons-16.png')` }"
    ><slot
  /></i>
</template>
