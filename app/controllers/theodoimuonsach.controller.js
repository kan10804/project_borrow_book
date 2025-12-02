const TheoDoiMuonSachService = require("../services/theodoimuonsach.service");
const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");

// Tạo bản ghi mượn sách
exports.create = async (req, res, next) => {
  if (!req.body?.MaDocGia || !req.body?.MaSach) {
    return next(new ApiError(400, "MaDocGia và MaSach không được để trống"));
  }

  // thêm mặc định
  if (!req.body.TrangThai) {
    req.body.TrangThai = "Chờ duyệt";
  }

  try {
    const service = new TheoDoiMuonSachService(MongoDB.client);
    const doc = await service.create(req.body);
    return res.send(doc);
  } catch (err) {
    return next(new ApiError(500, "Lỗi khi tạo bản ghi mượn sách"));
  }
};

// Lấy tất cả bản ghi hoặc theo MaDocGia
exports.findAll = async (req, res, next) => {
  try {
    const service = new TheoDoiMuonSachService(MongoDB.client);
    const { MaDocGia } = req.query;

    let docs = [];

    if (MaDocGia) {
      docs = await service.find({ MaDocGia: Number(MaDocGia) });
    } else {
      docs = await service.find({});
    }

    return res.send(docs);
  } catch (err) {
    return next(new ApiError(500, "Lỗi khi lấy danh sách mượn sách"));
  }
};

// Lấy 1 bản ghi theo id
exports.findOne = async (req, res, next) => {
  try {
    const service = new TheoDoiMuonSachService(MongoDB.client);
    const doc = await service.findById(req.params.id);

    if (!doc)
      return next(new ApiError(404, "Không tìm thấy bản ghi mượn sách"));

    return res.send(doc);
  } catch (err) {
    return next(new ApiError(500, "Lỗi khi lấy bản ghi mượn sách"));
  }
};

// Cập nhật bản ghi
exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0)
    return next(new ApiError(400, "Dữ liệu cập nhật không được để trống"));

  try {
    const service = new TheoDoiMuonSachService(MongoDB.client);
    const doc = await service.update(req.params.id, req.body);

    if (!doc)
      return next(new ApiError(404, "Không tìm thấy bản ghi mượn sách"));

    return res.send({ message: "Cập nhật bản ghi mượn thành công" });
  } catch (err) {
    return next(new ApiError(500, "Lỗi khi cập nhật bản ghi"));
  }
};

// Xóa một bản ghi
exports.delete = async (req, res, next) => {
  try {
    const service = new TheoDoiMuonSachService(MongoDB.client);
    const doc = await service.delete(req.params.id);

    if (!doc)
      return next(new ApiError(404, "Không tìm thấy bản ghi mượn sách"));

    return res.send({ message: "Xóa bản ghi mượn thành công" });
  } catch (err) {
    return next(new ApiError(500, "Lỗi khi xóa bản ghi"));
  }
};

// Xóa toàn bộ bản ghi theo MaDocGia
exports.deleteAll = async (req, res, next) => {
  try {
    const { MaDocGia } = req.query;

    if (!MaDocGia) {
      return next(new ApiError(400, "Thiếu MaDocGia để xóa lịch sử"));
    }

    const service = new TheoDoiMuonSachService(MongoDB.client);
    const result = await service.deleteAllByDocGia(MaDocGia);

    return res.send({
      message: `${result.deletedCount} bản ghi đã bị xóa`,
    });
  } catch (err) {
    return next(new ApiError(500, "Lỗi khi xóa lịch sử mượn"));
  }
};
