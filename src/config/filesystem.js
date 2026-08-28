import { ref, computed, defineAsyncComponent, markRaw } from "vue";

const counter = ref(0);
const increaseCounter = () => counter.value++;
window.i = increaseCounter;

export default {
  type: "folder",
  name: "Computer",
  icon: "computer",
  contents: {
    "test text file": {
      type: "file",
      extension: "txt",
      contents: "Hello World!",
    },
    someFolder: {
      type: "folder",
      contents: {
        anotherFile: {
          type: "file",
        },
      },
    },
    this: {
      type: "folder",
      contents: {
        is: {
          type: "folder",
          contents: {
            randomFolder: {
              name: "random folder that happens to have a very long annoying name",
              type: "folder",
              icon: {
                component: markRaw(
                  defineAsyncComponent(
                    async () => import("../components/icons/ClockIcon.vue"),
                  ),
                ),
              },
              contents: {},
            },
            computedFolder: {
              type: "folder",
              contents: computed(() => ({
                counter: {
                  type: "file",
                  contents: counter.value * 10,
                },
              })),
            },
            refFolder: {
              type: "folder",
              contents: {
                ref: {
                  type: "file",
                  contents: counter,
                },
              },
            },
          },
        },
      },
    },
  },
};
