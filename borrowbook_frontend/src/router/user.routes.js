export default [
  {
    path: "/user",
    component: () => import("@/layouts/UserLayout.vue"),
    children: [
      {
        path: "",
        name: "UserHome",
        component: () => import("@/views/user/UserHome.vue"),
      },
      {
        path: "borrow-book/:id",
        name: "BorrowBook",
        component: () => import("@/views/user/BorrowBook.vue"),
      },
      {
        path: "search",
        name: "SearchResult",
        component: () => import("@/views/user/SearchResult.vue"),
      },
      {
        path: "borrow-history",
        name: "BorrowHistory",
        component: () => import("@/views/user/BorrowHistory.vue"),
      },
    ],
  },
];
