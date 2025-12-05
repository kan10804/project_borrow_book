<template>
  <div class="container mt-4">

    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3>Lịch sử mượn sách</h3>

     
    </div>

    <!-- Không có dữ liệu -->
    <div v-if="records.length === 0" class="alert alert-info text-center">
      Bạn chưa mượn cuốn sách nào.
    </div>

    <!-- Danh sách lịch sử -->
    <div v-else class="table-responsive">
      <table class="table table-bordered align-middle">
        <thead class="table-primary text-center">
          <tr>
            <th>Mã sách</th>
            <th>Ngày mượn</th>
            <th>Ngày trả</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in records" :key="item._id">
            <td>{{ item.MaSach }}</td>
            <td>{{ item.NgayMuon }}</td>
            <td>{{ item.NgayTra }}</td>

            <td class="text-center">
              <span :class="statusClass(item.TrangThai)">
                {{ item.TrangThai }}
              </span>
            </td>

            <td class="text-center">
              <button class="btn btn-outline-danger btn-sm" @click="deleteOne(item._id)">
                <i class="bi bi-x-circle"></i> Huỷ mượn
              </button>
            </td>
          </tr>
        </tbody>

      </table>
    </div>

  </div>
</template>

<script>
import TheoDoiMuonSachService from "@/services/theodoimuonsach.service";

export default {
  name: "BorrowHistory",

  data() {
    return {
      user: null,
      records: []
    };
  },

  async mounted() {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      alert("Bạn cần đăng nhập!");
      this.$router.push("/");
      return;
    }

    this.user = JSON.parse(savedUser);

    await this.loadHistory();
  },

  methods: {
    async loadHistory() {
      try {
        const MaDocGia = String(this.user.MaDocGia);
        this.records = await TheoDoiMuonSachService.searchByDocGia(MaDocGia);
        console.log("Kết quả FE nhận:", this.records);

      } catch (err) {
        console.error(err);
        alert("Không thể tải lịch sử mượn sách!");
      }
    },
    statusClass(status) {
      switch (status) {
        case "Chờ duyệt":
          return "badge bg-warning text-dark";
        case "Đã duyệt":
          return "badge bg-info text-dark";
        case "Đã trả":
          return "badge bg-success";
        case "Từ chối":
          return "badge bg-danger";
        default:
          return "badge bg-secondary";
      }
    },

    async deleteOne(id) {
      if (!confirm("Bạn có chắc muốn xóa bản ghi này?")) return;

      try {
        await TheoDoiMuonSachService.delete(id);
        await this.loadHistory();
      } catch (err) {
        console.error(err);
        alert("Không thể xóa bản ghi!");
      }
    },

  }
};
</script>

<style scoped>
table th, table td {
  text-align: center;
}

.badge {
  font-size: 14px;
  padding: 6px 12px;
}
</style>
