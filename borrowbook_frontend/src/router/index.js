import { createRouter, createWebHistory } from "vue-router";

// Layout
import UserLayout from "@/layouts/UserLayout.vue";
import UserHome from "@/views/user/UserHome.vue";
import AdminLayout from "@/layouts/UserLayout.vue";
const EmptyPage = {
  template: "<h2 style='padding:20px'>Chức năng đang cập nhật...</h2>",
};

const routes = [
  {
    path: "/",
    component: UserLayout,
    children: [
      {
        path: "",
        name: "user-home",
        component: UserHome,
      },
      {
        path: "books",
        name: "user-books",
        component: EmptyPage,
      },
      {
        path: "search",
        name: "SearchResult",
        component: () => import("@/views/user/SearchResult.vue"),
      },
      {
        path: "borrow/:id",
        name: "BorrowBook",
        component: () => import("@/views/user/BorrowBook.vue"),
      },

      {
        path: "history",
        name: "user-history",
        component: () => import("@/views/user/BorrowHistory.vue"),
      },

      {
        path: "profile",
        name: "user-profile",
        component: EmptyPage,
      },
    ],
  },
];

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
