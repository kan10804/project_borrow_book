const NhaXuatBanService = require("../services/nhaxuatban.service");
const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
  if (!req.body?.MaNXB) {
    return next(new ApiError(400, "Mã nhà xuất bản không được để trống"));
  }

  try {
    const service = new NhaXuatBanService(MongoDB.client);
    const doc = await service.create(req.body);
    return res.send(doc);
  } catch (err) {
    return next(new ApiError(500, "Lỗi khi thêm nhà xuất bản"));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const service = new NhaXuatBanService(MongoDB.client);
    const { TenNXB } = req.query;

    let docs = [];
    if (TenNXB) docs = await service.findByName(TenNXB);
    else docs = await service.find({});

    return res.send(docs);
  } catch (err) {
    return next(new ApiError(500, "Lỗi khi lấy danh sách nhà xuất bản"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const service = new NhaXuatBanService(MongoDB.client);
    const doc = await service.findById(req.params.id);

    if (!doc) return next(new ApiError(404, "Không tìm thấy nhà xuất bản"));

    return res.send(doc);
  } catch (err) {
    return next(new ApiError(500, "Lỗi khi lấy nhà xuất bản"));
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0)
    return next(new ApiError(400, "Dữ liệu cập nhật không được để trống"));

  try {
    const service = new NhaXuatBanService(MongoDB.client);
    const doc = await service.update(req.params.id, req.body);

    if (!doc) return next(new ApiError(404, "Không tìm thấy nhà xuất bản"));

    return res.send({ message: "Cập nhật thông tin NXB thành công" });
  } catch (err) {
    return next(new ApiError(500, "Lỗi khi cập nhật nhà xuất bản"));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const service = new NhaXuatBanService(MongoDB.client);
    const doc = await service.delete(req.params.id);

    if (!doc) return next(new ApiError(404, "Không tìm thấy nhà xuất bản"));

    return res.send({ message: "Xóa nhà xuất bản thành công" });
  } catch (err) {
    return next(new ApiError(500, "Lỗi khi xóa nhà xuất bản"));
  }
};

exports.deleteAll = async (_req, res, next) => {
  try {
    const service = new NhaXuatBanService(MongoDB.client);
    const count = await service.deleteAll();
    return res.send({ message: `${count} nhà xuất bản đã bị xóa` });
  } catch (err) {
    return next(new ApiError(500, "Lỗi khi xóa toàn bộ nhà xuất bản"));
  }
};
