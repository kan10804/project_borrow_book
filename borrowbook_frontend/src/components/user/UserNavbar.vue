<template>
  <div>
    <div class="navbar" :style="navbarStyle">

      <!-- SEARCH BAR -->
      <div class="search-box">
        <i class="fas fa-search search-icon" @click="goSearch"></i>
        <input
          type="text"
          v-model="keyword"
          @input="handleTyping"
          @keyup.enter="goSearch"
          placeholder="Bạn có thể tìm sách ở đây..."
        />
      </div>

      <!-- RIGHT SECTION -->
      <div class="right">

        <!-- Nếu đăng nhập rồi -->
        <div v-if="loggedIn" class="user-info logged" @click="toggleMenu">
          <i class="fas fa-user avatar"></i>
          <span class="username">{{ usernameDisplay }}</span>
          <i class="fas fa-chevron-down arrow"></i>

          <div v-if="menuOpen" class="dropdown" @click.stop>
            <p @click="openProfile">Thông tin cá nhân</p>
            <p @click="logout">Đăng xuất</p>
          </div>
        </div>

        <!-- Chưa đăng nhập -->
        <div v-else class="user-info" @click="toggleMenu">
          <i class="fas fa-user avatar"></i>
          <span class="username">Đăng nhập</span>
          <i class="fas fa-chevron-down arrow"></i>

          <div v-if="menuOpen" class="dropdown">
            <p @click="openLogin">Đăng nhập</p>
            <p @click="openRegister">Đăng ký</p>
          </div>
        </div>

      </div>
    </div>

    <!-- POPUP FORM -->
    <div v-if="showPopup" class="popup-overlay" @click.self="closePopup">
      <div class="popup-box">

        <LoginForm
          v-if="popupMode === 'login'"
          @login="handleLogin"
        />

        <RegisterForm
          v-if="popupMode === 'register'"
          @register="handleRegister"
          @close="closePopup"
        />

        <EditProfileForm
          v-if="popupMode === 'edit'"
          :user="currentUser"
          @update="updateProfile"
          @close="closePopup"
        />

      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import LoginForm from "@/components/user/LoginForm.vue";
import RegisterForm from "@/components/user/RegisterForm.vue";
import EditProfileForm from "@/components/user/EditProfileForm.vue";

export default {
  name: "UserNavbar",
  components: { LoginForm, RegisterForm, EditProfileForm },

  props: {
    sidebarWidth: { type: Number, default: 240 }
  },

  data() {
    return {
      keyword: "",
      searchTimeout: null,

      menuOpen: false,
      showPopup: false,
      popupMode: "login",
      loggedIn: false,
      usernameDisplay: "",
      currentUser: null
    };
  },

  computed: {
    navbarStyle() {
      return {
        left: `${this.sidebarWidth}px`,
        width: `calc(100% - ${this.sidebarWidth}px)`
      };
    }
  },

  mounted() {
    const saved = localStorage.getItem("user");
    if (saved) {
      this.currentUser = JSON.parse(saved);
      this.usernameDisplay = `${this.currentUser.HoLot} ${this.currentUser.Ten}`;
      this.loggedIn = true;
    }
  },

  methods: {

    /* ============================
       SEARCH HANDLE
    ============================ */
    handleTyping() {
      clearTimeout(this.searchTimeout);

      this.searchTimeout = setTimeout(() => {
        if (this.keyword.trim()) {
          this.goSearch();
        }
      }, 300);
    },

    goSearch() {
      if (!this.keyword.trim()) return;

      // Gửi dạng: /search?TenSach=...
      this.$router.push({
        name: "SearchResult",
        query: { TenSach: this.keyword }
      });
    },

    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },

    openLogin() {
      this.popupMode = "login";
      this.showPopup = true;
      this.menuOpen = false;
    },

    openRegister() {
      this.popupMode = "register";
      this.showPopup = true;
      this.menuOpen = false;
    },

    openProfile() {
      this.popupMode = "edit";
      this.showPopup = true;
      this.menuOpen = false;
    },

    closePopup() {
      this.showPopup = false;
    },

    /* ============================
       LOGIN
    ============================ */
    async handleLogin(payload) {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/docgia/email/${payload.username}`
        );

        this.currentUser = res.data;
        localStorage.setItem("user", JSON.stringify(res.data));

        this.usernameDisplay = `${res.data.HoLot} ${res.data.Ten}`;
        this.loggedIn = true;

        this.closePopup();

      } catch (e) {
        alert("Sai tài khoản hoặc mật khẩu!");
      }
    },

    handleRegister() {
      this.closePopup();
    },

    /* ============================
       UPDATE PROFILE
    ============================ */
    async updateProfile(data) {
      try {
        const id = data.MaDocGia;

        const updateData = { ...data };
        delete updateData._id;

        const res = await axios.put(
          `http://localhost:3000/api/docgia/${id}`,
          updateData
        );

        const updatedUser = res.data.user;
        this.currentUser = updatedUser;

        localStorage.setItem("user", JSON.stringify(updatedUser));

        this.usernameDisplay = `${updatedUser.HoLot} ${updatedUser.Ten}`;

        alert("Cập nhật thành công!");
        this.closePopup();

      } catch (e) {
        alert("Lỗi cập nhật!");
        console.error(e);
      }
    },

    /* ============================
       LOGOUT
    ============================ */
    logout() {
      localStorage.removeItem("user");
      this.loggedIn = false;
      this.usernameDisplay = "";
      this.currentUser = null;
      this.menuOpen = false;
    }
  }
};
</script>

<style scoped>
/* NAVBAR */
.navbar {
  height: 70px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  border-bottom: 1px solid #eee;
  position: fixed;
  top: 0;
  z-index: 1000;
  transition: left 0.2s ease, width 0.2s ease;
}

/* SEARCH BOX */
.search-box {
  position: relative;
  width: 350px;
}

.search-box input {
  width: 100%;
  height: 45px;
  padding: 10px 15px 10px 42px;
  background: #f3f6ff;
  border: 1px solid #e5e7ff;
  border-radius: 12px;
  font-size: 14px;
  outline: none;
  transition: 0.2s;
}

.search-box input:focus {
  border: 1px solid #4760ff;
  box-shadow: 0 0 6px rgba(80, 110, 255, 0.3);
}

.search-icon {
  position: absolute;
  top: 14px;
  left: 14px;
  font-size: 16px;
  color: #8c8c8c;
  cursor: pointer;
}

/* RIGHT */
.right {
  display: flex;
  align-items: center;
  gap: 25px;
}

/* USER INFO */
.user-info {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.avatar {
  font-size: 22px;
  color: #555;
}

.username {
  font-weight: 600;
}

.arrow {
  font-size: 12px;
  color: #666;
}

/* DROPDOWN */
.dropdown {
  position: absolute;
  top: 45px;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 170px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.1);
  z-index: 1100;
}

.dropdown p {
  padding: 10px;
  margin: 0;
  cursor: pointer;
}

.dropdown p:hover {
  background: #f0f0f0;
}

/* POPUP OVERLAY */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

/* BOX */
.popup-box {
  background: transparent !important;
  padding: 0 !important;
  width: auto !important;
  border-radius: 0 !important;
  box-shadow: none !important;
}
</style>
