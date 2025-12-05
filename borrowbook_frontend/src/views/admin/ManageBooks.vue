<template>
  <div class="container-fluid py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Quản lý Sách</h2>
      <button class="btn btn-primary" @click="$router.push({ name: 'AddBook' })">
        <i class="fas fa-plus me-2"></i> Thêm sách mới
      </button>
    </div>

    <!-- Search and Filter -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-6">
            <input 
              type="text" 
              class="form-control" 
              placeholder="Tìm kiếm tên sách..." 
              v-model="searchKeyword"
              @input="searchBooks"
            />
          </div>
          <div class="col-md-6">
            <input 
              type="text" 
              class="form-control" 
              placeholder="Tìm kiếm theo tác giả..." 
              v-model="searchAuthor"
              @input="searchBooks"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Books Table -->
    <div class="card">
      <div class="table-responsive">
        <table class="table table-hover mb-0">
          <thead class="table-light">
            <tr>
              <th>Mã sách</th>
              <th>Tên sách</th>
              <th>Tác giả</th>
              <th>Nhà xuất bản</th>
              <th>Năm xuất bản</th>
              <th>Số lượng</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredBooks.length === 0">
              <td colspan="7" class="text-center py-4">
                <i class="fas fa-inbox text-muted"></i>
                <p class="text-muted mt-2">Không có sách nào</p>
              </td>
            </tr>
            <tr v-for="book in filteredBooks" :key="book._id">
              <td><strong>{{ book.MaSach }}</strong></td>
              <td>{{ book.TenSach }}</td>
              <td>{{ book.TacGia }}</td>
              <td>{{ getPublisherName(book) }}</td>
              <td>{{ book.NamXuatBan }}</td>
              <td>
                <span class="badge" :class="(book.SoQuyen || book.SoLuong || 0) > 0 ? 'bg-success' : 'bg-danger'">
                  {{ book.SoQuyen || book.SoLuong || 0 }}
                </span>
              </td>
              <td>
                <button class="btn btn-sm btn-warning me-2" @click="$router.push({ name: 'EditBook', params: { id: book._id } })">
                  <i class="fas fa-edit"></i> Sửa
                </button>
                <button class="btn btn-sm btn-danger" @click="deleteBook(book._id)">
                  <i class="fas fa-trash"></i> Xóa
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
  name: "ManageBooks",
  data() {
    return {
      books: [],
      filteredBooks: [],
      publishers: [],
      searchKeyword: "",
      searchAuthor: ""
    };
  },

  mounted() {
    this.loadPublishers();
    this.loadBooks();
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

    async loadBooks() {
      try {
        const res = await axios.get("http://localhost:3000/api/books");
        this.books = res.data;
        this.filteredBooks = res.data;
      } catch (error) {
        console.error("Error loading books:", error);
        alert("Lỗi khi tải danh sách sách!");
      }
    },

    getPublisherName(book) {
      // Thử tìm theo MaNXB (ID của nhà xuất bản)
      if (book.MaNXB) {
        const pubById = this.publishers.find(p => p._id === book.MaNXB);
        if (pubById) return pubById.TenNXB;
      }
      
      // Nếu không tìm được theo ID, thử tìm theo MaNXB (mã nhà xuất bản)
      if (book.MaNXB) {
        const pubByCode = this.publishers.find(p => p.MaNXB === book.MaNXB);
        if (pubByCode) return pubByCode.TenNXB;
      }
      
      // Nếu không có MaNXB, dùng NhaXuatBan trực tiếp (dữ liệu cũ)
      return book.NhaXuatBan || "N/A";
    },

    searchBooks() {
      this.filteredBooks = this.books.filter(book => {
        const keywordMatch = book.TenSach.toLowerCase().includes(this.searchKeyword.toLowerCase());
        const authorMatch = book.TacGia.toLowerCase().includes(this.searchAuthor.toLowerCase());
        return keywordMatch && authorMatch;
      });
    },

    async deleteBook(bookId) {
      if (!confirm("Bạn có chắc muốn xóa sách này?")) {
        return;
      }

      try {
        await axios.delete(`http://localhost:3000/api/books/${bookId}`);
        alert("Xóa sách thành công!");
        this.loadBooks();
      } catch (error) {
        console.error("Error deleting book:", error);
        alert("Lỗi khi xóa sách: " + (error.response?.data?.message || error.message));
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
}
</style>
