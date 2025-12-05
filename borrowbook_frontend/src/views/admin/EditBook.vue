<template>
  <div class="container-fluid py-4">
    <div class="d-flex align-items-center mb-4">
      <button class="btn btn-secondary me-3" @click="goBack">
        <i class="fas fa-arrow-left me-2"></i> Quay lại
      </button>
      <h2>{{ isEditMode ? "Sửa thông tin sách" : "Thêm sách mới" }}</h2>
    </div>

    <div class="card">
      <div class="card-body">
        <form @submit.prevent="saveBook">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Tên sách *</label>
              <input 
                type="text" 
                class="form-control" 
                v-model="formData.TenSach" 
                required
              />
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label">Tác giả *</label>
              <input 
                type="text" 
                class="form-control" 
                v-model="formData.TacGia" 
                required
              />
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Nhà xuất bản *</label>
              <select 
                class="form-control" 
                v-model="formData.MaNXB" 
                required
              >
                <option value="">-- Chọn nhà xuất bản --</option>
                <option v-for="pub in publishers" :key="pub._id" :value="pub._id">
                  {{ pub.TenNXB }}
                </option>
              </select>
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label">Năm xuất bản *</label>
              <input 
                type="number" 
                class="form-control" 
                v-model.number="formData.NamXuatBan" 
                required
              />
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Số quyển *</label>
              <input 
                type="number" 
                class="form-control" 
                v-model.number="formData.SoQuyen" 
                required
              />
            </div>

            <!-- Đơn giá removed per requirement -->
          </div>

          <!-- Mô tả removed per requirement -->

          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-primary">
              <i class="fas fa-save me-2"></i>{{ isEditMode ? "Cập nhật" : "Thêm mới" }}
            </button>
            <button type="button" class="btn btn-secondary" @click="goBack">
              <i class="fas fa-times me-2"></i>Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "EditBook",
  data() {
    return {
      publishers: [],
      isEditMode: false,
      formData: {
        TenSach: "",
        TacGia: "",
        MaNXB: "",
        NamXuatBan: new Date().getFullYear(),
        SoQuyen: 1
        ,
        MoTa: ""
      },
      editingBookId: null
    };
  },

  mounted() {
    this.loadPublishers();
    
    // Kiểm tra nếu đang edit sách (có ID trong route params)
    if (this.$route.params.id) {
      this.isEditMode = true;
      this.editingBookId = this.$route.params.id;
      this.loadBook();
    }
  },

  methods: {
    async loadPublishers() {
      try {
        const res = await axios.get("http://localhost:3000/api/nhaxuatban");
        this.publishers = res.data || [];
      } catch (error) {
        console.error("Error loading publishers:", error);
      }
    },

    async loadBook() {
      try {
        const res = await axios.get(`http://localhost:3000/api/books/${this.editingBookId}`);
        const book = res.data;
        this.formData = {
          TenSach: book.TenSach,
          TacGia: book.TacGia,
          MaNXB: book.MaNXB,
          NamXuatBan: book.NamXuatBan,
          SoQuyen: book.SoQuyen || book.SoLuong || 1,
          MoTa: book.MoTa || ""
        };
      } catch (error) {
        console.error("Error loading book:", error);
        alert("Lỗi khi tải thông tin sách!");
        this.goBack();
      }
    },

    async saveBook() {
      try {
        if (this.isEditMode) {
          // Update existing book
          await axios.put(
            `http://localhost:3000/api/books/${this.editingBookId}`,
            this.formData
          );
          alert("Cập nhật sách thành công!");
        } else {
          // Create new book; server will generate MaSach
          await axios.post("http://localhost:3000/api/books", this.formData);
          alert("Thêm sách thành công!");
        }
        this.goBack();
      } catch (error) {
        console.error("Error saving book:", error);
        alert("Lỗi khi lưu sách: " + (error.response?.data?.message || error.message));
      }
    },

    goBack() {
      this.$router.push({ name: "ManageBooks" });
    }
  }
};
</script>

<style scoped>
.container-fluid {
  padding-left: 0;
  padding-right: 0;
}

.card {
  border: none;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.form-label {
  font-weight: 500;
}

.btn {
  min-width: 120px;
}
</style>
