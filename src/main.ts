import { createApp } from "vue";
import "./style/tailwindcss.css";

import App from "./App.vue";
import store from "./store";
import nativeUI from "./install/nativeUI";
import setupRouter from "./router";

(async () => {
  const app = createApp(App);
  await setupRouter(app);
  app.use(store).use(nativeUI).mount("#app");
})();
