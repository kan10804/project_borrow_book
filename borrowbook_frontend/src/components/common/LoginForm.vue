<template>
  <div class="login-card shadow-lg rounded-4 p-4">
    <h2 class="text-center fw-bold mb-4 text-primary">
      <i class="fa fa-right-to-bracket me-2"></i> Đăng nhập
    </h2>

    <!-- Username -->
    <div class="modern-input mb-3">
      <i class="fa fa-user icon"></i>
      <input type="text" class="" placeholder="Tài khoản..." v-model="username" />
    </div>

    <!-- Password -->
    <div class="modern-input mb-3">
      <i class="fa fa-lock icon"></i>
      <input type="password" class="" placeholder="Mật khẩu..." v-model="password" />
    </div>

    <!-- Login Button -->
    <button class="btn btn-primary w-100 py-2 fw-semibold rounded-3"
            @click="login">
      <i class="fa fa-check me-2"></i>Đăng nhập
    </button>

    <p v-if="message" class="text-danger text-center mt-2 fw-semibold">{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: "LoginForm",
  data() {
    return {
      username: "",
      password: "",
      message: ""
    };
  },
  methods: {
    login() {
      if (!this.username || !this.password) {
        this.message = "Vui lòng nhập tài khoản và mật khẩu!";
        return;
      }

      // gửi dữ liệu lên component cha
      this.$emit("login", {
        username: this.username,
        password: this.password
      });
    }
  }
};
</script>

<style scoped>
.login-card {
  width: 420px;
  background: #ffffff;
  border-radius: 20px;
  animation: fadeIn 0.25s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Modern Input */
.modern-input {
  display: flex;
  align-items: center;
  background: #f0f3ff;
  border: 1px solid #d6dbff;
  padding: 10px 12px;
  border-radius: 10px;
  gap: 10px;
}

.modern-input input {
  border: none;
  outline: none;
  background: none;
  flex: 1;
  font-size: 15px;
}

.icon {
  color: #4a60ff;
  font-size: 18px;
}
</style>
