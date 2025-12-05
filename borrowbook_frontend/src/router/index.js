import { createRouter, createWebHistory } from "vue-router";

import userRoutes from "./user.routes";
import adminRoutes from "./admin.routes";

const router = createRouter({
  history: createWebHistory(),

  routes: [
    // Redirect root to user home so opening http://localhost:3002 shows the UI
    { path: "/", redirect: "/user" },
    ...userRoutes,
    ...adminRoutes,
  ],
});

export default router;
