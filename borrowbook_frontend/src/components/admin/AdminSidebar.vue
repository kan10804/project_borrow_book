<template>
  <div class="sidebar">

    <!-- LOGO -->
    <div class="logo">
      <i class="fas fa-home logo-icon"></i>
      <span class="logo-text">Góc Sách</span>
    </div>

    <!-- MENU CHÍNH -->
    <ul class="menu">

      <li :class="{ active: isActive('/') }" @click="go('/')">
        <i class="fas fa-compass"></i>
        <span>Quản lý sách</span>
      </li>

      <li :class="{ active: isActive('/') }" @click="go('/')">
      <i class="fas fa-layer-group"></i>
        <span>Quản lý mượn sách</span>
      </li>
    </ul>

    <hr />

    <!-- MENU DƯỚI -->
   

  </div>
</template>

<script>
export default {
  name: "UserSidebar",
  methods: {
    go(path) {
      this.$router.push(path);
    },
    isActive(path) {
      return this.$route.path === path;
    },
    logout() {
      alert("Đăng xuất!");
    },
  },
};
</script>

<style scoped>
.sidebar {
  width: 240px;
  height: 100vh;
  background: #ffffff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  padding: 25px 20px;
  position: fixed;
  display: flex;
  flex-direction: column;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 30px;
  color: #1e1e1e;
}

.logo-icon {
  color: #275efe;
  font-size: 22px;
}

/* Menu */
.menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 10px;
  cursor: pointer;
  color: #6b6b6b;
  font-size: 16px;
  border-radius: 8px;
  transition: 0.2s;
}

.menu li i {
  font-size: 18px;
}

/* Hover */
.menu li:hover {
  background: #eef3ff;
  color: #275efe;
}

/* Active */
.menu li.active {
  background: #e0e9ff;
  color: #275efe;
  font-weight: 600;
}

hr {
  margin: 25px 0;
  border: none;
  border-top: 1px solid #ececec;
}
</style>
