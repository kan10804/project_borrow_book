const DocGiaService = require("../services/docgia.service");
const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
  if (!req.body?.MaDocGia) {
    return next(new ApiError(400, "Mã độc giả không được để trống"));
  }

  try {
    const service = new DocGiaService(MongoDB.client);
    const doc = await service.create(req.body);
    return res.send(doc);
  } catch (err) {
    return next(new ApiError(500, "Lỗi khi thêm độc giả"));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const service = new DocGiaService(MongoDB.client);
    const { Ten } = req.query;
    let docs = [];

    if (Ten) docs = await service.findByName(Ten);
    else docs = await service.find({});

    return res.send(docs);
  } catch (err) {
    return next(new ApiError(500, "Lỗi khi lấy danh sách độc giả"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const service = new DocGiaService(MongoDB.client);
    const doc = await service.findById(req.params.id);

    if (!doc) return next(new ApiError(404, "Không tìm thấy độc giả"));

    return res.send(doc);
  } catch (err) {
    return next(new ApiError(500, "Lỗi khi lấy độc giả"));
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0)
    return next(new ApiError(400, "Dữ liệu cập nhật không được để trống"));

  try {
    const service = new DocGiaService(MongoDB.client);
    const doc = await service.update(req.params.id, req.body);

    if (!doc) return next(new ApiError(404, "Không tìm thấy độc giả"));

    return res.send({ message: "Cập nhật độc giả thành công" });
  } catch (err) {
    return next(new ApiError(500, "Lỗi khi cập nhật độc giả"));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const service = new DocGiaService(MongoDB.client);
    const doc = await service.delete(req.params.id);

    if (!doc) return next(new ApiError(404, "Không tìm thấy độc giả"));

    return res.send({ message: "Xóa độc giả thành công" });
  } catch (err) {
    return next(new ApiError(500, "Lỗi khi xóa độc giả"));
  }
};

exports.deleteAll = async (_req, res, next) => {
  try {
    const service = new DocGiaService(MongoDB.client);
    const count = await service.deleteAll();

    return res.send({ message: `${count} độc giả đã bị xóa` });
  } catch (err) {
    return next(new ApiError(500, "Lỗi khi xóa toàn bộ độc giả"));
  }
};
