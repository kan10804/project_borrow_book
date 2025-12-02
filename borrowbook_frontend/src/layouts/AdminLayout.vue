<template>
  <div class="layout">
    <!-- SIDEBAR -->
    <AdminSidebar />

    <!-- MAIN CONTENT -->
    <div class="content">
      <AdminNavbar />

      <!-- Nơi router-view của Admin -->
      <div class="page-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import AdminNavbar from "@/components/common/AdminNavbar.vue";
import AdminSidebar from "@/components/common/AdminSidebar.vue";

export default {
  name: "AdminLayout",
  components: {
    AdminNavbar,
    AdminSidebar,
  },
};
</script>

<style scoped>
.layout {
  display: flex;
  width: 100%;
  min-height: 100vh;
}

/* Vùng chính sau sidebar */
.content {
  margin-left: 240px;
  width: calc(100% - 240px);
  background: #f7f7f7;
  min-height: 100vh;
}

/* Vùng hiển thị nội dung Admin */
.page-content {
  padding: 20px;
  padding-top: 90px; /* ⭐️ thêm khoảng trống cho navbar fixed */
}
</style>
