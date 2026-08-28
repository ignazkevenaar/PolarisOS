<script setup>
import { ref, toValue, watch, inject } from "vue";
import MosaicArrow from "../../mosaic/MosaicArrow.vue";

const emit = defineEmits(["activate"]);

const props = defineProps({
  folder: {
    type: Object,
    default: () => ({}),
  },
  // Key of the item to highlight in this column: either the next-level
  // folder that's already open, or the current selection in this column.
  activeKey: {
    type: String,
    default: null,
  },
});

const folderItems = ref(undefined);
const active = inject("windowActive");

watch(
  () => props.folder,
  async (newFolder) => {
    if (newFolder === undefined || newFolder.type !== "folder") {
      folderItems.value = undefined;
      return;
    }
    const folderContents = toValue(await newFolder.contents);
    folderItems.value = folderContents;
  },
  { immediate: true },
);
</script>

<template>
  <div class="column emboss">
    <!-- Clicking the background deselects and closes any columns downstream. -->
    <ul @click="emit('activate')">
      <li v-for="(item, key) in folderItems" :key>
        <button
          class="reserve-space"
          :class="{
            'bevel color-tertiary': activeKey === key,
            active: activeKey === key && active,
          }"
          @click.prevent.stop="
            emit('activate', key, item, item.type === 'folder')
          "
          @dblclick.prevent.stop="
            item.type !== 'folder'
              ? emit('activate', key, item, true)
              : undefined
          "
        >
          <span>
            {{ item.name ?? key }}
          </span>
          <MosaicArrow v-if="item.type === 'folder'"></MosaicArrow>
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
ul {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow-y: auto;
  scrollbar-gutter: safe;
  list-style: none;

  li {
    padding: 0;
  }

  button {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    appearance: none;
    border-inline-width: 0;
    padding: 2px 4px;
    width: 100%;

    &:not(.active) {
      background-color: transparent;
    }

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

a {
  color: currentColor;
  text-decoration: none;
}
</style>
