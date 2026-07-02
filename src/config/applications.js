import BrowserApplication from "../components/applications/BrowserApplication.vue";
import ContainerApplication from "../components/applications/ContainerApplication.vue";
import ShredderApplication from "../components/applications/ShredderApplication.vue";
import EightBallApplication from "../components/applications/EightBallApplication.vue";
import FontApplication from "../components/applications/FontApplication.vue";
import TestApplication from "../components/applications/TestApplication.vue";
import ThemeApplication from "../components/applications/ThemeApplication.vue";
import XEyesApplication from "../components/applications/XEyesApplication.vue";
import ClockIcon from "../components/icons/ClockIcon.vue";

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
    contentWidth: 192,
    contentHeight: 186,
    transparent: true,
    minimizable: false,
  },
  browser: {
    name: "Browser",
    component: BrowserApplication,
    icon: "browser",
    resizable: true,
    width: 800,
    height: 600,
  },
  eightBall: {
    name: "Magic 8-Ball",
    title: "Shake me",
    component: EightBallApplication,
    icon: "eightball",
    contentWidth: 256,
    contentHeight: 256,
    transparent: true,
    minimizable: false,
    dragDirectly: true,
  },
  theme: {
    name: "Themes",
    title: "Themes",
    component: ThemeApplication,
    icon: "paintroller",
    width: 600,
  },
  font: {
    name: "Fonts",
    title: "Fonts",
    component: FontApplication,
    icon: "fonts",
    width: 600,
    height: 400,
  },
  styleManager: {
    name: "Style Manager",
    title: "Style Manager",
    component: ContainerApplication,
    icon: "palette",
    width: 300,
    height: 200,
    resizable: true,
    items: ["theme", "font"],
  },
  utilities: {
    name: "Utilities",
    title: "Utilities",
    component: ContainerApplication,
    icon: "wrench",
    width: 300,
    height: 200,
    resizable: true,
    items: ["styleManager", "shredder"],
  },
  trash: {
    name: "Trashcan",
    title: "Trashcan",
    component: ContainerApplication,
    icon: "trash",
    width: 640,
    height: 480,
    resizable: true,
    items: ["eightBall", "eyes"],
  },
  aboutMe: {
    name: "About me",
    title: "About me",
    component: ContainerApplication,
    icon: "rolodex",
    width: 480,
    height: 320,
    resizable: true,
    items: [
      {
        name: "Who's this guy!?",
        icon: "ignaz",
        href: "aboutme",
      },
    ],
  },
  clock: {
    name: "Clock",
    title: "Clock",
    component: TestApplication,
    icon: {
      component: ClockIcon,
    },
  },
  shredder: {
    name: "Shredder",
    title: "Shredder",
    component: ShredderApplication,
    icon: "shredder",
    closable: false,
    minimizable: false,
    center: true,
  },
};
