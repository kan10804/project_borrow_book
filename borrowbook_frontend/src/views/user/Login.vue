<template>
  <div class="d-flex justify-content-center mt-5">
    <LoginForm @login="handleLogin" />
  </div>
</template>

<script>
import LoginForm from "@/components/common/LoginForm.vue";
import DocGiaService from "@/services/docgia.service";
import NhanVienService from "@/services/nhanvien.service";

export default {
  components: { LoginForm },

  methods: {
    async handleLogin({ username, password }) {
      // 1) Kiểm tra độc giả
      const dg = await DocGiaService.findByEmail(username);
      if (dg && dg.Password === password) {
        localStorage.setItem("user", JSON.stringify({
          role: "docgia",
          ...dg
        }));
        this.$router.push({ name: "UserHome" });
        return;
      }

      // 2) Kiểm tra nhân viên
      const nvArr = await NhanVienService.findByName(username);
      const nv = nvArr[0];
      if (nv && nv.Password === password) {
        localStorage.setItem("user", JSON.stringify({
          role: "nhanvien",
          ...nv
        }));
        this.$router.push({ name: "AdminHome" });
        return;
      }

      alert("Sai tài khoản hoặc mật khẩu!");
    }
  }
};
</script>
