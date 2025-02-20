import type { RouteRecordRaw } from "vue-router";
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Root",
    redirect: {
      name: "ChatRoot",
    },
  },
  {
    path: "/chat",
    component: () => import("@/components/layout/index.vue"),
    name: "ChatRoot",
    redirect: {
      name: "ChatIndex",
    },
    children: [
      {
        path: "",
        name: "ChatIndex",
        component: () => import("@/view/chat/index.vue"),
      },
    ],
  },
  {
    path: "/:catchAll(.*)",
    name: "404",
    component: () => import("@/components/404/index.vue"),
  },
];

export default routes;
