<template>
  <div class="edit-card shadow rounded-4 p-4">

    <h3 class="text-center text-primary fw-bold mb-3">
      <i class="fa fa-user-edit me-2"></i>Chỉnh sửa thông tin
    </h3>

    <div class="row g-3">

      <!-- Họ lót -->
      <div class="col-md-6">
        <input type="text" class="form-control" v-model="form.HoLot" placeholder="Họ lót...">
      </div>

      <!-- Tên -->
      <div class="col-md-6">
        <input type="text" class="form-control" v-model="form.Ten" placeholder="Tên...">
      </div>

      <!-- Ngày sinh -->
      <div class="col-md-6">
        <label class="form-label">Ngày sinh</label>
        <input type="date" class="form-control" v-model="form.NgaySinh">
      </div>

      <!-- Giới tính -->
      <div class="col-md-6">
        <label class="form-label">Giới tính</label>
        <select class="form-select" v-model="form.Phai">
          <option value="">-- Chọn --</option>
          <option>Nam</option>
          <option>Nữ</option>
          <option>Khác</option>
        </select>
      </div>

      <!-- Địa chỉ -->
      <div class="col-12">
        <input type="text" class="form-control" v-model="form.DiaChi" placeholder="Địa chỉ...">
      </div>

      <!-- Điện thoại -->
      <div class="col-12">
        <input type="text" class="form-control" v-model="form.DienThoai" placeholder="Điện thoại...">
      </div>

      <!-- Email -->
      <div class="col-12">
        <input type="email" class="form-control" v-model="form.Email" placeholder="Email...">
      </div>

      <!-- BUTTON -->
      <div class="col-12 mt-3">
        <button @click="save" class="btn btn-success w-100">
          <i class="fa fa-save me-2"></i>Lưu thay đổi
        </button>
      </div>

    </div>

  </div>
</template>

<script>
export default {
  name: "EditProfileForm",

  props: {
    user: Object,
  },

  data() {
    return {
      form: { ...this.user },
    };
  },

  methods: {
    save() {
      this.$emit("update", this.form);
    }
  }
};
</script>

<style scoped>
.edit-card {
  width: 480px;
  background: #fff;
  border-radius: 20px;
}
</style>
