<template>
  <div class="layout">

    <AdminSidebar />


    <div class="content">
      <AdminNavbar />

      <div class="page-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import AdminNavbar from "@/components/admin/AdminNavbar.vue";
import AdminSidebar from "@/components/admin/AdminSidebar.vue";

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


.content {
  margin-left: 240px;
  width: calc(100% - 240px);
  background: #f7f7f7;
  min-height: 100vh;
}

.page-content {
  padding: 20px;
  padding-top: 90px; 
}
</style>
