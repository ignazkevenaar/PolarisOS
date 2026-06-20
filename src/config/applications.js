import BrowserApplication from "../components/applications/BrowserApplication.vue";
import ContainerApplication from "../components/applications/ContainerApplication.vue";
import TestApplication from "../components/applications/TestApplication.vue";
import XEyesApplication from "../components/applications/XEyesApplication.vue";

export default {
  test: {
    name: "Test, but it's actually very very long which might prove a problem...",
    title: "someTitle",
    component: TestApplication,
    icon: "application",
  },
  eyes: {
    name: "XEyes",
    title: "XEyes",
    component: XEyesApplication,
    icon: "eyes",
    width: 188,
    height: 186,
    transparent: true,
    minimizable: false,
  },
  container: {
    name: "Container",
    title: "Container",
    component: ContainerApplication,
    icon: "application",
    items: ["eyes", "test", "eyes", "test", "eyes", "test"],
    resizable: true,
  },
  browser: {
    name: "Browser",
    component: BrowserApplication,
    icon: "browser",
    resizable: true,
    width: 800,
    height: 600,
  },
};
