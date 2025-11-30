const express = require("express");
const books = require("../controllers/book.controller");

const router = express.Router();

// Đường dẫn gốc: /api/books
router
  .route("/")
  .get(books.findAll) // Lấy danh sách mượn sách
  .post(books.create) // Tạo bản ghi mượn mới
  .delete(books.deleteAll); // Xóa tất cả bản ghi (nếu cần)

router.route("/favorite").get(books.findAllFavorite); // Lấy danh sách sách đang mượn (chưa trả)

router
  .route("/:id")
  .get(books.findOne) // Lấy chi tiết 1 lần mượn
  .put(books.update) // Cập nhật (ví dụ: đánh dấu đã trả)
  .delete(books.delete); // Xóa 1 bản ghi mượn sách

module.exports = router;
