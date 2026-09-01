import { useProcessManager } from "../composables/processManager";

const { applicationIndex, getApplicationManifest } = useProcessManager();

export default {
  type: "folder",
  name: "Computer",
  icon: "computer",
  contents: {
    Apps: {
      type: "folder",
      contents: async () => {
        const result = {};
        const filteredApps = Object.keys(applicationIndex.value).filter(
          (path) => !path.startsWith("polaris/utilities/"),
        );
        for (const applicationID of filteredApps) {
          const applicationManifest =
            await getApplicationManifest(applicationID);

          result[applicationID] = {
            type: "application",
            name: applicationManifest.name,
            icon: applicationManifest.icon,
          };
        }
        return result;
      },
    },
    Utilities: {
      type: "folder",
      contents: async () => {
        const result = {};
        const filteredApps = Object.keys(applicationIndex.value).filter(
          (path) => path.startsWith("polaris/utilities/"),
        );
        for (const applicationID of filteredApps) {
          const applicationManifest =
            await getApplicationManifest(applicationID);

          result[applicationID] = {
            type: "application",
            name: applicationManifest.name,
            icon: applicationManifest.icon,
          };
        }
        return result;
      },
    },
    Me: {
      type: "folder",
      icon: "home",
      contents: {
        "about me": {
          type: "file",
          extension: "link",
          content: "aboutme/",
        },
      },
    },
  },
};
