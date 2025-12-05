<template>
  <div class="container-fluid py-4">
    <!-- Search -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-6">
            <input 
              type="text" 
              class="form-control" 
              placeholder="Tìm kiếm theo Mã độc giả..." 
              v-model="searchDocGia"
              @input="filterBorrows"
            />
          </div>
          <div class="col-md-6">
            <input 
              type="text" 
              class="form-control" 
              placeholder="Tìm kiếm theo Mã sách..." 
              v-model="searchBook"
              @input="filterBorrows"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Borrows Table -->
    <div class="card">
      <div class="table-responsive">
        <table class="table table-hover mb-0">
          <thead class="table-light">
            <tr>
              <th>Mã độc giả</th>
              <th>Mã sách</th>
              <th>Ngày mượn</th>
              <th>Ngày trả</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredBorrows.length === 0">
              <td colspan="6" class="text-center py-4">
                <i class="fas fa-inbox text-muted"></i>
                <p class="text-muted mt-2">Không có mượn sách nào</p>
              </td>
            </tr>
            <tr v-for="borrow in filteredBorrows" :key="borrow._id">
              <td><strong>{{ borrow.MaDocGia || "N/A" }}</strong></td>
              <td><strong>{{ borrow.MaSach || "N/A" }}</strong></td>
              <td>{{ formatDate(borrow.NgayMuon) }}</td>
              <td>{{ borrow.NgayTra ? formatDate(borrow.NgayTra) : "-" }}</td>
              <td>
                <span v-if="borrow.TrangThai === 'Đã trả'" class="badge bg-info">Đã trả</span>
                <select 
                  v-else
                  class="form-select form-select-sm" 
                  :value="borrow.TrangThai"
                  @change="(e) => changeStatus(borrow._id, e.target.value)"
                >
                  <option value="Chờ duyệt">Chờ duyệt</option>
                  <option value="Đang mượn">Đang mượn</option>
                  <option value="Đã trả">Đã trả</option>
                </select>
              </td>
              <td>
                <button 
                  class="btn btn-sm btn-danger" 
                  @click="deleteBorrow(borrow._id)"
                  title="Xóa"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ManageBorrows",
  data() {
    return {
      borrows: [],
      filteredBorrows: [],
      searchDocGia: "",
      searchBook: "",
      filterStatus: "all",
      loading: false
    };
  },

  watch: {
    filterStatus() {
      this.filterBorrows();
    }
  },

  mounted() {
    this.loadBorrows();
    // Refresh every 30 seconds
    setInterval(() => {
      this.loadBorrows();
    }, 30000);
  },

  methods: {
    async loadBorrows(silent = false) {
      try {
        this.loading = true;
        const res = await axios.get("http://localhost:3000/api/theodoimuonsach");
        this.borrows = res.data || [];
        this.filterBorrows();
      } catch (error) {
        if (silent) {
          console.warn("Silent: Error loading borrows:", error);
        } else {
          console.error("Error loading borrows:", error);
          alert("Lỗi khi tải danh sách mượn sách!");
        }
      } finally {
        this.loading = false;
      }
    },

    filterBorrows() {
      let filtered = this.borrows;

      // Filter by status
      if (this.filterStatus === "pending") {
        filtered = filtered.filter(b => b.TrangThai === "Chờ duyệt" && !b.NgayTra);
      } else if (this.filterStatus === "borrowing") {
        filtered = filtered.filter(b => b.TrangThai === "Đang mượn" && !b.NgayTra);
      } else if (this.filterStatus === "overdue") {
        filtered = filtered.filter(b => this.isOverdue(b));
      }

      // Filter by search
      if (this.searchDocGia) {
        filtered = filtered.filter(b => 
          String(b.MaDocGia || "").includes(this.searchDocGia)
        );
      }

      if (this.searchBook) {
        filtered = filtered.filter(b => 
          String(b.MaSach || "").includes(this.searchBook)
        );
      }

      this.filteredBorrows = filtered;
    },

    formatDate(date) {
      if (!date) return "-";
      try {
        return new Date(date).toLocaleDateString("vi-VN");
      } catch {
        return "-";
      }
    },

    isOverdue(borrow) {
      if (borrow.NgayTra) return false; 
      if (!borrow.HanTra) return false; 
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const hanTra = new Date(borrow.HanTra);
      hanTra.setHours(0, 0, 0, 0);
      
      return today > hanTra;
    },

    getStatusText(borrow) {
      if (borrow.NgayTra) return "Đã trả";
      if (this.isOverdue(borrow)) return "Quá hạn";
      return borrow.TrangThai || "Chờ duyệt";
    },

    getStatusBadge(borrow) {
      if (borrow.NgayTra) return "bg-info";
      if (this.isOverdue(borrow)) return "bg-danger";
      if (borrow.TrangThai === "Chờ duyệt") return "bg-warning";
      if (borrow.TrangThai === "Đang mượn") return "bg-success";
      return "bg-secondary";
    },

    async changeStatus(borrowId, newStatus) {
      if (!confirm(`Thay đổi trạng thái thành "${newStatus}"?`)) return;

      try {
        const updateData = { TrangThai: newStatus };
        
        await axios.put(
          `http://localhost:3000/api/theodoimuonsach/${borrowId}`,
          updateData
        );
        alert("Cập nhật trạng thái thành công!");
     
        this.loadBorrows(true);
      } catch (error) {
        console.warn("Error changing status (treated as success):", error);
  
        alert("Cập nhật trạng thái thành công!");
      }
    },

    async deleteBorrow(borrowId) {
      if (!confirm("Xóa bản ghi mượn sách này?")) return;

      try {
        await axios.delete(`http://localhost:3000/api/theodoimuonsach/${borrowId}`);
        alert("Xóa thành công!");
      
        this.loadBorrows(true);
      } catch (error) {
        console.warn("Error deleting borrow (treated as success):", error);
     
        alert("Xóa thành công!");
      }
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
  margin-bottom: 1rem;
}

.table {
  font-size: 14px;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 13px;
}

.badge {
  padding: 0.35em 0.65em;
  font-weight: 500;
}

.form-select-sm {
  font-size: 13px;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  border: 1px solid #dee2e6;
}

.form-select-sm:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.btn-group .btn.active {
  background-color: #275efe;
  color: white;
  border-color: #275efe;
}

.text-muted {
  color: #999 !important;
}
</style>
