import { useProcessManager } from "./processManager";

const { openFile } = useProcessManager();

export function useBrowser() {
  const openLink = (URL) => {
    if (!URL) return;

    openFile(undefined, {
      type: "file",
      extension: "link",
      content: URL,
    });
  };

  return {
    openLink,
  };
}
