<script setup>
import { onMounted, ref, nextTick } from "vue";
import ApplicationWindow from "../ApplicationWindow.vue";
import LargeIcon from "../LargeIcon.vue";
import IconButton from "../IconButton.vue";
import DialogWindow from "../DialogWindow.vue";
import { useWindowManager } from "../../composables/windowManager.js";
import ApplicationGhost from "../ApplicationGhost.vue";

const { createOrSwitchToExistingWindow } = useWindowManager();

const iconNames = [
  "clock",
  "calendar",
  "eyes",
  "mailbox",
  "browser",
  "camera",
  "trash",
  "briefcase",
  "finder",
  "palette",
  "cd",
  "picture",
  "eightball",
  "model",
  "ferrari",
  "games",
  "ignaz",
  "rolodex",
  "wrench",
  "application",
  "grab",
  "winamp",
  "fonts",
  "paintroller",
  "shredder",
  "warning",
  "wallpaper",
  "modernmouse",
  "mouse",
  "inspector",
  "error",
  "helmsman",
  "lifesaver",
  "tips",
  "computer",
  "computer2",
  "file",
  "folder",
];

const boardWidth = 6;
const boardHeight = 5;

const board = ref(undefined);
const matched = ref(undefined);
const disabled = ref(false);

const firstIndex = ref(undefined);
const secondIndex = ref(undefined);

const startNewGame = () => {
  const totalCells = boardWidth * boardHeight;

  const cells = [
    ...Array(totalCells / 2).keys(),
    ...Array(totalCells / 2).keys(),
  ];

  const getRandomIndex = () => Math.round(Math.random() * (totalCells - 1));

  for (let i = 0; i < 256; i++) {
    const firstIndex = getRandomIndex();
    const secondIndex = getRandomIndex();

    const temp = cells[firstIndex];
    cells[firstIndex] = cells[secondIndex];
    cells[secondIndex] = temp;
  }

  board.value = cells;
  matched.value = Array(totalCells).fill(false);
};

onMounted(startNewGame);

const tryCell = async (index) => {
  if (firstIndex.value === undefined) {
    firstIndex.value = index;
  } else {
    disabled.value = true;
    secondIndex.value = index;

    if (board.value[firstIndex.value] === board.value[secondIndex.value]) {
      matched.value[firstIndex.value] = true;
      matched.value[secondIndex.value] = true;
      console.log("Matched pair!", iconNames[board.value[firstIndex.value]]);
    } else {
      // Temporary show results
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    firstIndex.value = undefined;
    secondIndex.value = undefined;
    disabled.value = false;
  }
};

const newGameDialogOpen = ref(false);
const testDialog = ref(undefined);
const dialogWindow = ref(undefined);

const maybeNewGame = async () => {
  newGameDialogOpen.value = true;

  await nextTick();
  console.log(testDialog.value);

  const window = createOrSwitchToExistingWindow(
    "com.memory.newgame",
    /*DialogWindow*/ undefined,
    {
      text: "werkt dit?",
    },
  );

  dialogWindow.value = window;
};
</script>
<template>
  <ApplicationWindow>
    <div class="toolbar">
      <IconButton text="New game..." @click="maybeNewGame" />
      <ApplicationGhost :window="dialogWindow" v-if="newGameDialogOpen">
        <div>Do you want to start a new game, really!? are you mad!?</div>
      </ApplicationGhost>
    </div>
    <div class="grid" :style="{ '--cols': boardWidth }">
      <IconButton
        v-for="(cell, cellIndex) in board"
        :key="cellIndex"
        @click="tryCell(cellIndex)"
        :disabled="
          disabled ||
          matched[cellIndex] ||
          firstIndex === cellIndex ||
          secondIndex === cellIndex
        "
      >
        <LargeIcon
          :icon="iconNames[cell]"
          v-if="
            matched[cellIndex] ||
            firstIndex === cellIndex ||
            secondIndex === cellIndex
          "
        ></LargeIcon>
      </IconButton>
    </div>
  </ApplicationWindow>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(var(--cols), 1fr);
  grid-auto-rows: 1fr;
  place-items: stretch;
}

:deep(button) {
  display: grid;
  place-items: center;
  padding: 4px;

  &:disabled > * {
    opacity: 1;
  }
}
</style>
