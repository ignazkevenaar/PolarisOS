import { useProcessManager } from "./processManager";

const { openFile } = useProcessManager();

export function useBrowser() {
  const openLink = (URL) => {
    if (!URL) return;

    openFile(".link", {
      type: "file",
      content: URL,
    });
  };

  return {
    openLink,
  };
}
