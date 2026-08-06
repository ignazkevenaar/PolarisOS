<script setup>
import { computed } from "vue";
import LargeIcon from "./LargeIcon.vue";
const props = defineProps({
  icon: {
    type: [String, Object],
    required: true,
  },
});

const iconProps = computed(() => {
  // eslint-disable-next-line no-unused-vars
  const { component, ...rest } = props.icon;
  return rest;
});
</script>
<template>
  <template v-if="icon">
    <LargeIcon v-if="typeof icon === 'string'" :icon />
    <Component v-else :is="icon.component" v-bind="iconProps"></Component>
  </template>
</template>
