<template>
  <div class="register-card shadow-lg rounded-4 p-4">
    <h2 class="text-center fw-bold mb-4 text-primary">
      <i class="fa fa-user-plus me-2"></i>Đăng ký tài khoản
    </h2>

    <div class="row g-3">
      <!-- Họ lót -->
      <div class="col-md-6">
        <div class="modern-input">
          <i class="fa fa-user icon"></i>
          <input type="text" placeholder="Họ lót" v-model="HoLot" />
        </div>
      </div>

      <!-- Tên -->
      <div class="col-md-6">
        <div class="modern-input">
          <i class="fa fa-user icon"></i>
          <input type="text" placeholder="Tên" v-model="Ten" />
        </div>
      </div>

      <!-- Ngày sinh -->
      <div class="col-12">
        <label class="form-label fw-semibold">Ngày sinh</label>
        <input type="date" class="form-control modern-field" v-model="NgaySinh" />
      </div>

      <!-- Giới tính -->
      <div class="col-12">
        <label class="form-label fw-semibold">Giới tính</label>
        <select class="form-select modern-field" v-model="Phai">
          <option value="">-- Chọn giới tính --</option>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
          <option value="Khác">Khác</option>
        </select>
      </div>

      <!-- Địa chỉ -->
      <div class="col-12">
        <div class="modern-input">
          <i class="fa fa-location-dot icon"></i>
          <input type="text" placeholder="Địa chỉ" v-model="DiaChi" />
        </div>
      </div>

      <!-- Điện thoại -->
      <div class="col-12">
        <div class="modern-input">
          <i class="fa fa-phone icon"></i>
          <input type="text" placeholder="Điện thoại" v-model="DienThoai" />
        </div>
      </div>

      <!-- Email -->
      <div class="col-12">
        <div class="modern-input">
          <i class="fa fa-envelope icon"></i>
          <input type="email" placeholder="Email" v-model="Email" autocomplete="off" />
        </div>
      </div>

      <!-- Password -->
      <div class="col-12">
        <div class="modern-input">
          <i class="fa fa-lock icon"></i>
          <input type="password" placeholder="Mật khẩu" v-model="Password" autocomplete="new-password" />
        </div>
      </div>

      <!-- Confirm -->
      <div class="col-12">
        <div class="modern-input">
          <i class="fa fa-lock icon"></i>
          <input type="password" placeholder="Nhập lại mật khẩu" v-model="Confirm" autocomplete="new-password" />
        </div>
      </div>

      <!-- Button -->
      <div class="col-12">
        <button class="btn btn-primary w-100 py-2 fw-semibold rounded-3" @click="registerUser">
          <i class="fa fa-check me-2"></i>Tạo tài khoản
        </button>
      </div>

      <p v-if="message" class="text-center mt-2 text-danger fw-semibold">{{ message }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  emits: ["close"],

  data() {
    return {
      Email: "",
      Password: "",
      Confirm: "",
      HoLot: "",
      Ten: "",
      NgaySinh: "",
      Phai: "",
      DiaChi: "",
      DienThoai: "",
      message: "",
    };
  },

  methods: {
    validateFields() {
      if (!this.HoLot || !this.Ten || !this.NgaySinh || !this.Phai ||
          !this.DiaChi || !this.DienThoai || !this.Email ||
          !this.Password || !this.Confirm) 
      {
        this.message = "❌ Vui lòng nhập đầy đủ tất cả các trường!";
        return false;
      }

      if (this.Password !== this.Confirm) {
        this.message = "❌ Mật khẩu nhập lại không khớp!";
        return false;
      }

      return true;
    },

    async registerUser() {
      if (!this.validateFields()) return;

      try {
        const payload = {
          MaDocGia: Date.now(),
          Email: this.Email,
          Password: this.Password,
          HoLot: this.HoLot,
          Ten: this.Ten,
          NgaySinh: this.NgaySinh,
          Phai: this.Phai,
          DiaChi: this.DiaChi,
          DienThoai: this.DienThoai,
        };

        await axios.post("http://localhost:3000/api/docgia", payload);

        this.message = "🎉 Đăng ký thành công!";

        // reset form
        Object.assign(this.$data, this.$options.data());
        setTimeout(() => {
          this.$emit("close");
        }, 800);

      } catch (e) {
        this.message = e.response?.data?.message || "Lỗi đăng ký!";
      }
    }
  }
};
</script>

<style scoped>
.register-card {
  width: 480px;
  background: #ffffff;
  border-radius: 20px;
  animation: fadeIn 0.25s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}

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
  background: none;
  outline: none;
  flex: 1;
  font-size: 15px;
}

.modern-field {
  border-radius: 10px;
  background: #f0f3ff;
  border: 1px solid #d6dbff;
}

.icon {
  color: #4a60ff;
  font-size: 17px;
}
</style>
