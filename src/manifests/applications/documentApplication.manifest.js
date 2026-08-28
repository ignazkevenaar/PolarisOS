import { h, Teleport } from "vue";
import TestApplication from "../../components/applications/TestApplication.vue";

export default {
  name: "Test application with documents",
  icon: "file",
  entry: async ({ registerEventListener }) => {
    registerEventListener("path", (path) => {
      console.log("current path", path);
      // Open window for path, if path is undefined, open a blank window.
    });

    // const vnode = () =>
    //   h(
    //     Teleport,
    //     { to: "body" },
    //     {
    //       default: () => h(TestApplication, { title: "Hello" }),
    //     },
    //   );

    const vnode = () => h(TestApplication, { title: "Hello" });

    console.log(vnode());

    return new Promise(() => {
      // Wait forever.
    });
  },
};
