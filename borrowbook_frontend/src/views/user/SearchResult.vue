<template>
  <div class="container py-4 user-home">

    <!-- Title -->
    <h3 class="mb-4">Kết quả tìm kiếm cho: "{{ keyword }}"</h3>

    <!-- Không có sách -->
    <div v-if="books.length === 0" class="text-center text-muted fs-5">
      Không tìm thấy sách nào.
    </div>

    <!-- Danh sách sách -->
    <ul class="book-grid" v-else>
      <li
        class="book-item card h-100 shadow-sm"
        v-for="book in books"
        :key="book._id"
      >
        <!-- Ảnh sách -->
        <div class="image-container">
          <img :src="book.AnhSach" class="card-img-top" alt="Book Image" />
        </div>

        <div class="card-body d-flex flex-column">
          <h6 class="fw-bold book-title">{{ book.TenSach }}</h6>
          <p class="text-muted small book-author">{{ book.TacGia }}</p>

          <button class="btn btn-primary mt-auto borrow-btn" @click="borrow(book)">
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
  name: "SearchResult",

  data() {
    return {
      keyword: "",
      books: []
    };
  },

  async created() {
    this.keyword = this.$route.query.TenSach || "";

    if (this.keyword.trim()) {
      try {
        this.books = await BookService.findByName(this.keyword);
      } catch (e) {
        console.error("Lỗi tìm sách:", e);
      }
    }
  },

  // 🔥 FIX QUAN TRỌNG: Cập nhật khi từ khóa thay đổi
  watch: {
    "$route.query.TenSach": {
      async handler(newValue) {
        if (!newValue) return;

        this.keyword = newValue;

        try {
          this.books = await BookService.findByName(newValue);
        } catch (e) {
          console.error("Lỗi tìm sách:", e);
        }
      }
    }
  },

  methods: {
    borrow(book) {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        alert("Bạn cần đăng nhập trước khi mượn sách!");
        return;
      }

      if (!book.MaSach) {
        console.error("Sách không có MaSach!");
        return;
      }

      this.$router.push({
        name: "BorrowBook",
        params: { id: book.MaSach }
      });
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

.book-title {
  min-height: 40px;
  font-weight: 600;
}

.book-author {
  min-height: 22px;
}

.borrow-btn {
  font-weight: 600;
  border-radius: 8px;
}
</style>
