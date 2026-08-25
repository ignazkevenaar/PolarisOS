export default {
  name: "Test application with documents",
  icon: "file",
  entry: async ({ registerEventListener }) => {
    registerEventListener("path", (path) => {
      console.log("current path", path);
      // Open window for path, if path is undefined, open a blank window.
    });

    return new Promise(() => {
      // Wait forever.
    });
  },
};
