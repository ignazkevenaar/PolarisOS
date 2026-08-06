import { ref, computed, defineAsyncComponent } from "vue";

const counter = ref(0);
const increaseCounter = () => counter.value++;
window.i = increaseCounter;

export default {
  type: "folder",
  name: "Computer",
  icon: "computer",
  contents: {
    someFile: {
      type: "file",
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
                component: defineAsyncComponent(
                  async () => import("../components/icons/ClockIcon.vue"),
                ),
              },
              async contents() {
                const result = {};
                for (let i = 0; i < 10; i++) {
                  const rand = Math.random();
                  result[rand] = {
                    type: "file",
                    name: rand,
                  };
                }
                return result;
              },
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
