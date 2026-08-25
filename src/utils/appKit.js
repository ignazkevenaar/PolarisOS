import { useWindowManager } from "../composables/windowManager";
import { watch } from "vue";
const { processIDsWithOpenWindows } = useWindowManager();

export const waitForAllWindows = async (processID, run) => {
  const promise = new Promise((resolve) => {
    watch(processIDsWithOpenWindows, (newIDs) => {
      if (!newIDs.has(processID)) resolve(0);
    });
  });
  await run();

  return promise;
};
