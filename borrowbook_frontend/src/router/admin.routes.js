import AdminHome from "@/views/admin/AdminHome.vue";
import ManageBooks from "@/views/admin/ManageBooks.vue";
import ManageBorrows from "@/views/admin/ManageBorrows.vue";
import EditBook from "@/views/admin/EditBook.vue";

export default [
  {
    path: "/admin",
    component: () => import("@/layouts/AdminLayout.vue"),
    children: [
      {
        path: "",
        name: "AdminHome",
        component: AdminHome,
      },
      {
        path: "books",
        name: "ManageBooks",
        component: ManageBooks,
      },
      {
        path: "books/new",
        name: "AddBook",
        component: EditBook,
      },
      {
        path: "books/:id/edit",
        name: "EditBook",
        component: EditBook,
      },
      {
        path: "borrows",
        name: "ManageBorrows",
        component: ManageBorrows,
      },
    ],
  },
];
