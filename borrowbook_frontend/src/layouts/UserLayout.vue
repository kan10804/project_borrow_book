<template>
  <div class="layout">
    <!-- SIDEBAR -->
    <UserSidebar />

    <!-- MAIN CONTENT -->
    <div class="content">
      <UserNavbar />

      <!-- Nơi router-view của user -->
      <div class="page-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import UserNavbar from "@/components/user/UserNavbar.vue";
import UserSidebar from "@/components/user/UserSidebar.vue";


export default {
  name: "UserLayout",
  components: {
    UserNavbar,
    UserSidebar,
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

/* Vùng hiển thị nội dung user */
.page-content {
  padding: 20px;
  padding-top: 90px; /* ⭐️ thêm khoảng trống cho navbar fixed */
}
</style>
