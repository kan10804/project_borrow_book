<template>
  <div class="container-fluid py-4">
    <div class="card position-relative">
      <div class="card-body">
        <button class="btn btn-light mb-3" @click="$router.back()">
          <i class="fas fa-arrow-left me-2"></i> Quay lại
        </button>

        <div v-if="loading" class="text-center">Đang tải...</div>

        <div v-else-if="!book">
          <p class="text-muted">Không tìm thấy sách.</p>
        </div>

        <div v-else>
          <div class="d-flex justify-content-between align-items-start mb-3">
            <h3 class="mb-0">{{ book.TenSach }}</h3>
            <div>
              <button class="btn btn-primary" @click="goBorrow">
                <i class="bi bi-book-half me-2"></i> Mượn sách
              </button>
            </div>
          </div>

          <div class="row mt-3">
            <!-- ẢNH SÁCH -->
            <div class="col-md-4 text-start">
              <img
                :src="book.AnhSach || '/placeholder-book.png'"
                class="img-fluid mb-3"
                alt="Ảnh sách"
              />
            </div>

            <!-- THÔNG TIN SÁCH -->
            <div class="col-md-8">
              <dl class="row">
                <dt class="col-sm-4">Tác giả</dt>
                <dd class="col-sm-8">{{ book.TacGia || '-' }}</dd>

                <dt class="col-sm-4">Nhà xuất bản</dt>
                <dd class="col-sm-8">{{ publisherName || book.MaNXB || '-' }}</dd>

                <dt class="col-sm-4">Năm xuất bản</dt>
                <dd class="col-sm-8">{{ book.NamXuatBan || '-' }}</dd>

                <dt class="col-sm-4">Số quyển</dt>
                <dd class="col-sm-8">{{ book.SoQuyen || book.SoLuong || '-' }}</dd>
              </dl>

              <hr />

              <h5>Mô tả</h5>
              <p v-if="book.MoTa" v-html="book.MoTa"></p>
              <p v-else class="text-muted">Chưa có mô tả cho sách này.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'BookDetail',
  data() {
    return {
      book: null,
      loading: true,
      publisherName: ''
    };
  },

  mounted() {
    this.loadBook();
  },

  methods: {
    async loadBook() {
      try {
        const id = this.$route.params.id;
        const res = await axios.get(`http://localhost:3000/api/books/${id}`);
        this.book = res.data;

        if (this.book && this.book.MaNXB) {
          this.loadPublisher(this.book.MaNXB);
        }
      } catch (error) {
        console.error('Error loading book detail:', error);
        this.book = null;
      } finally {
        this.loading = false;
      }
    },

    async loadPublisher(id) {
      try {
        const res = await axios.get(`http://localhost:3000/api/nhaxuatban/${id}`);
        const pub = res.data;
        this.publisherName = pub?.TenNXB || '';
        if (this.publisherName) return;
      } catch {}

      try {
        const resAll = await axios.get('http://localhost:3000/api/nhaxuatban');
        const pubs = Array.isArray(resAll.data) ? resAll.data : [];
        const match = pubs.find(
          p => String(p._id) === String(id) || String(p.MaNXB) === String(id) || String(p.TenNXB) === String(id)
        );
        this.publisherName = match ? match.TenNXB : '';
      } catch {
        this.publisherName = '';
      }
    },

    goBorrow() {
      const user = JSON.parse(localStorage.getItem('user'));

      if (!user) {
        alert('Bạn cần đăng nhập để mượn sách');
        this.$router.push({ name: 'Login' });
        return;
      }

      const bookId = this.book?.MaSach || this.book?._id;
      this.$router.push({ name: 'BorrowBook', params: { id: bookId } });
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
  position: relative;
}

/* Nút mượn sách góc phải */
.borrow-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}

img {
  max-height: 300px;
  object-fit: contain;
}
</style>
