<script setup>
import { ref, toValue, watch } from "vue";
import MosaicArrow from "../../mosaic/MosaicArrow.vue";
const model = defineModel({ type: String });
const emit = defineEmits(["open"]);

const props = defineProps({
  folder: {
    type: Object,
    default: () => ({}),
  },
});

// Might wanna share this between the views...
// <FolderContents :folder="folder" v-slot="{contents}"></FolderContents>
const folderItems = ref(undefined);

watch(
  () => props.folder,
  async (newFolder) => {
    if (newFolder === undefined) return;
    const folderContents = toValue(await newFolder.contents);
    folderItems.value = folderContents;
  },
  { immediate: true },
);
</script>

<template>
  <div class="column emboss">
    <ul @click="model = ''">
      <li v-for="(item, key) in folderItems" :key>
        <button
          class="reserve-space"
          :class="{ 'bevel color-tertiary active': model === key }"
          @click.prevent.stop="model = key"
          @dblclick.prevent="item.type !== 'folder' && emit('open', key)"
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
    padding: 2px 8px;
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
