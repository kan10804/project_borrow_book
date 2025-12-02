<template>
  <div class="container mt-4">
    <div class="card shadow-sm mx-auto" style="max-width: 550px;">
      <div class="card-header bg-primary text-white text-center">
        <h4 class="mb-0">Phiếu Mượn Sách</h4>
      </div>

      <div class="card-body">
        <form @submit.prevent="submitBorrow">

          <!-- Tên độc giả -->
          <div class="mb-3">
            <label class="form-label fw-semibold">Tên độc giả</label>
            <input type="text" class="form-control" v-model="form.TenDocGia" disabled />
          </div>

          <!-- Mã sách -->
          <div class="mb-3">
            <label class="form-label fw-semibold">Mã sách</label>
            <input type="text" class="form-control" v-model="form.MaSach" disabled />
          </div>

          <!-- Ngày mượn -->
          <div class="mb-3">
            <label class="form-label fw-semibold">Ngày mượn</label>
            <input 
              type="date" 
              class="form-control"
              v-model="form.NgayMuon"
              required 
            />
          </div>

          <!-- Ngày trả -->
          <div class="mb-3">
            <label class="form-label fw-semibold">Ngày trả dự kiến (tối đa 2 tuần)</label>
            <input 
              type="date" 
              class="form-control"
              v-model="form.NgayTra"
              :min="form.NgayMuon"
              :max="maxReturnDate"
              required 
            />
          </div>

          <button type="submit" class="btn btn-primary w-100 fw-semibold">
            <i class="bi bi-check-circle"></i> Xác nhận mượn
          </button>

        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "BorrowBook",

  data() {
    return {
      form: {
        MaDocGia: "",
        TenDocGia: "",
        MaSach: this.$route.params.id || "",
        NgayMuon: this.getToday(),
        NgayTra: ""
      },
      maxReturnDate: ""
    };
  },

  mounted() {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Bạn cần đăng nhập!");
      this.$router.push("/");
      return;
    }

    this.form.MaDocGia = user.MaDocGia;
    this.form.TenDocGia = `${user.HoLot} ${user.Ten}`;

    // Ngày trả tối đa 14 ngày từ hôm nay
    this.maxReturnDate = this.getDateAfterDays(14);
  },

  methods: {
    getToday() {
      return new Date().toISOString().split("T")[0];
    },

    getDateAfterDays(days) {
      const d = new Date();
      d.setDate(d.getDate() + days);
      return d.toISOString().split("T")[0];
    },

    async submitBorrow() {
      if (this.form.NgayTra > this.maxReturnDate) {
        alert("❌ Ngày trả không được quá 14 ngày!");
        return;
      }

      const payload = {
        MaDocGia: this.form.MaDocGia,
        MaSach: this.form.MaSach,
        NgayMuon: this.form.NgayMuon,
        NgayTra: this.form.NgayTra
      };

      try {
        await axios.post("http://localhost:3000/api/theodoimuonsach", payload);

        alert("✔ Mượn sách thành công!");
        this.$router.push("/");
      } catch (error) {
        console.error(error);
        alert("❌ Không thể mượn sách!");
      }
    }
  }
};
</script>

<style scoped>
/* Không cần CSS vì đã dùng Bootstrap */
</style>
