const BookService = require("../services/book.service");
const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");

// Tạo sách mới
exports.create = async (req, res, next) => {
  if (!req.body?.TenSach) {
    return next(new ApiError(400, "Tên sách không được để trống"));
  }

  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "Đã xảy ra lỗi khi thêm sách mới"));
  }
};

// Lấy danh sách tất cả sách hoặc tìm theo tên
exports.findAll = async (req, res, next) => {
  let documents = [];

  try {
    const bookService = new BookService(MongoDB.client);
    const { TenSach } = req.query;

    if (TenSach) {
      documents = await bookService.findByName(TenSach);
    } else {
      documents = await bookService.find({});
    }

    return res.send(documents);
  } catch (error) {
    return next(
      new ApiError(500, "Đã xảy ra lỗi khi truy xuất danh sách sách")
    );
  }
};

// Lấy thông tin chi tiết 1 sách
exports.findOne = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.findById(req.params.id);

    if (!document) {
      return next(new ApiError(404, "Không tìm thấy sách"));
    }

    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi lấy thông tin sách id=${req.params.id}`)
    );
  }
};

// Cập nhật thông tin sách
exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Dữ liệu cập nhật không được để trống"));
  }

  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.update(req.params.id, req.body);

    if (!document) {
      return next(new ApiError(404, "Không tìm thấy sách"));
    }

    return res.send({ message: "Cập nhật sách thành công" });
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi cập nhật sách id=${req.params.id}`));
  }
};

// Xóa 1 sách
exports.delete = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.delete(req.params.id);

    if (!document) {
      return next(new ApiError(404, "Không tìm thấy sách"));
    }

    return res.send({ message: "Xóa sách thành công" });
  } catch (error) {
    return next(new ApiError(500, `Không thể xóa sách id=${req.params.id}`));
  }
};

// Lấy danh sách sách đang được mượn (ví dụ: favorite)
exports.findAllFavorite = async (_req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const documents = await bookService.findFavorite();
    return res.send(documents);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy danh sách sách đang được mượn"));
  }
};

// Xóa tất cả sách
exports.deleteAll = async (_req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const deletedCount = await bookService.deleteAll();
    return res.send({
      message: `${deletedCount} sách đã được xóa thành công`,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xóa tất cả sách"));
  }
};
