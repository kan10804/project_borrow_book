<template>
  <div class="container py-4 user-home">

    <!-- Loading -->
    <div v-if="books.length === 0" class="text-center py-5">
      <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;"></div>
      <p class="mt-3 fs-5 text-secondary">Đang tải dữ liệu sách...</p>
    </div>

    <!-- Danh sách sách -->
    <ul class="book-grid" v-else>
      <li
        class="book-item card h-100 shadow-sm"
        v-for="book in books"
        :key="book._id"
        @click="viewDetail(book)"
      >
        <!-- Ảnh sách -->
        <div class="image-container">
          <img :src="book.AnhSach" class="card-img-top" alt="Book Image" />
        </div>

          <div class="card-body d-flex flex-column">
          <!-- Tên sách -->
          <h6 class="fw-bold book-title">{{ book.TenSach }}</h6>

          <!-- Tác giả -->
          <p class="text-muted small book-author">{{ book.TacGia }}</p>

          <!-- Nút mượn -->
          <button class="btn btn-primary mt-auto borrow-btn" @click.stop="borrow(book)">
            <i class="bi bi-book-half"></i> Mượn
          </button>
        </div>
      </li>
    </ul>

  </div>
</template>

<script>
import BookService from "@/services/book.service";

export default {
  name: "UserHome",

  data() {
    return {
      books: [],
    };
  },

  async created() {
    try {
      this.books = await BookService.getAll();
    } catch (error) {
      console.error("Lỗi tải sách:", error);
    }
  },

  methods: {
    borrow(book) {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        alert("Bạn cần đăng nhập trước khi mượn sách!");
        this.$router.push({ name: "Login" });
        return;
      }

      if (!book.MaSach) {
        console.error("Sách không có mã sách (MaSach)!");
        return;
      }

      this.$router.push({
        name: "BorrowBook",
        params: { id: book.MaSach },
      });
    }
    ,
    viewDetail(book) {
      // Navigate to BookDetail using the MongoDB _id so the backend can fetch by ObjectId
      if (!book._id) {
        console.error('Missing book._id for detail route');
        return;
      }
      this.$router.push({ name: 'BookDetail', params: { id: book._id } });
    }
  }
};
</script>

<style scoped>
/* GRID 5 CỘT */
.book-grid {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 22px;
}

/* CARD */
.book-item {
  border-radius: 14px;
  overflow: hidden;
  transition: 0.25s;
}

.book-item:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.15);
}

.book-item { cursor: pointer; }

/* Ảnh */
.image-container {
  height: 220px;
  overflow: hidden;
}

.image-container img {
  object-fit: cover;
  width: 100%;
  height: 100%;
  transition: 0.3s;
}

.image-container:hover img {
  transform: scale(1.05);
}

/* Tên sách */
.book-title {
  min-height: 40px;
  font-weight: 600;
}

/* Tác giả */
.book-author {
  min-height: 22px;
}

/* Nút mượn */
.borrow-btn {
  font-weight: 600;
  border-radius: 8px;
}
</style>
