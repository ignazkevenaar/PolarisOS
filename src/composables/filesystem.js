import { ref, toValue } from "vue";
import filesystem from "../config/filesystem";

const reactiveFilesystem = ref(undefined);

// eslint-disable-next-line no-unused-vars
const parseFolder = async ([name, fileOrFolder]) => {
  if (fileOrFolder === undefined) return fileOrFolder;

  if (fileOrFolder.type !== "folder") {
    return fileOrFolder;
  }

  // Transform .contents into getter
  fileOrFolder._contents = fileOrFolder.contents;
  delete fileOrFolder.contents;
  Object.defineProperty(fileOrFolder, "contents", {
    get: async () => {
      if (typeof fileOrFolder._contents === "function")
        return toValue(await fileOrFolder._contents());

      return fileOrFolder._contents;
    },
  });

  // Use newly created getter :)
  Object.entries(toValue(await fileOrFolder.contents)).map(parseFolder);

  return fileOrFolder;
};

const pathSeparator = "/";

const initalizeFS = async () => {
  const result = await parseFolder([undefined, filesystem]);
  reactiveFilesystem.value = result;
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

    const outputFolders = [reactiveFilesystem.value];
    let reference = await reactiveFilesystem.value.contents;

    try {
      for (const [partIndex, part] of parts.entries()) {
        if (part === "" && partIndex === 0) continue; // Skip

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
  };

  return {
    getFile,
    getFolderUp,
    pathSeparator,
    splitPathToParts,
    iconMap,
  };
}
