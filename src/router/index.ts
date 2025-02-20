import type { App } from "vue";
import routes from "./routes";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default async function setupRouter(app: App) {
  app.use(router);
  await router.isReady();
}
