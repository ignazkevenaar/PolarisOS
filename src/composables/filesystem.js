import { ref, toValue, isRef } from "vue";
import filesystem from "../config/filesystem";

const reactiveFilesystem = ref(undefined);

const isComputed = (value) => isRef(value) && "effect" in value;

const parseFolder = async (fileOrFolder) => {
  if (fileOrFolder.type !== "folder") {
    return fileOrFolder;
  }

  // Transform .contents into getter
  fileOrFolder._contents = fileOrFolder.contents;
  delete fileOrFolder.contents;
  Object.defineProperty(fileOrFolder, "contents", {
    get: async () => {
      if (isComputed(fileOrFolder._contents)) {
        return toValue(fileOrFolder._contents);
      } else if (typeof fileOrFolder._contents === "function")
        return toValue(await fileOrFolder._contents());

      return fileOrFolder._contents;
    },
  });

  Object.values(toValue(await fileOrFolder.contents)).map(parseFolder);

  return fileOrFolder;
};

const rootPath = "";
const pathSeparator = "/";

const initalizeFS = async () => {
  const result = await parseFolder(filesystem[rootPath]);
  reactiveFilesystem.value = {
    [rootPath]: result,
  };
};
initalizeFS();

export function useFilesystem() {
  const splitPathToParts = (path) => {
    let correctedPath = path;
    if (correctedPath.endsWith(pathSeparator)) {
      correctedPath = correctedPath.substring(0, correctedPath.length - 1);
    }
    const splitPath = correctedPath.split(pathSeparator);
    return splitPath;
  };

  const getFolderUp = (path) => {
    const parts = path.split(pathSeparator);
    parts.pop();

    const result = parts.join(pathSeparator);
    return result;
  };

  const getFile = async (pathOrParts, withIntermediateFolders = false) => {
    const parts = Array.isArray(pathOrParts)
      ? pathOrParts
      : splitPathToParts(pathOrParts);

    const outputFolders = [reactiveFilesystem.value[rootPath]];
    let reference = await outputFolders.at(-1).contents;

    try {
      for (const [partIndex, part] of parts.entries()) {
        if (part === rootPath && partIndex === 0) continue; // Skip

        const fileOrFolder = reference?.[part];

        if (fileOrFolder === undefined) {
          console.error(part, "not in", reference);
          throw new Error();
        }

        outputFolders.push(fileOrFolder);

        if (partIndex < parts.length - 1) {
          reference = toValue(await fileOrFolder.contents); // Unwrap reactive elements
        }
      }
    } catch (error) {
      console.error("File not found", pathOrParts, error);
      return undefined;
    }

    if (withIntermediateFolders) return outputFolders;
    return outputFolders.at(-1);
  };

  const iconMap = {
    folder: "folder",
    file: "file",
    undefined: "file",
  };

  return {
    getFile,
    getFolderUp,
    pathSeparator,
    splitPathToParts,
    iconMap,
  };
}
