const NhanVienService = require("../services/nhanvien.service");
const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
  if (!req.body?.MSNV) {
    return next(new ApiError(400, "Mã nhân viên không được để trống"));
  }

  try {
    const service = new NhanVienService(MongoDB.client);
    const doc = await service.create(req.body);
    return res.send(doc);
  } catch (err) {
    return next(new ApiError(500, "Lỗi khi thêm nhân viên"));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const service = new NhanVienService(MongoDB.client);
    const { HoTenNV } = req.query;

    let docs = [];
    if (HoTenNV) docs = await service.findByName(HoTenNV);
    else docs = await service.find({});

    return res.send(docs);
  } catch (err) {
    return next(new ApiError(500, "Lỗi khi lấy danh sách nhân viên"));
  }
};
exports.findByMSNV = async (req, res, next) => {
  try {
    const msnv = req.params.msnv;
    const service = new NhanVienService(MongoDB.client);
    const result = await service.findByMSNV(msnv);

    if (!result) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên" });
    }

    res.send(result);
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const service = new NhanVienService(MongoDB.client);
    const doc = await service.findById(req.params.id);

    if (!doc) return next(new ApiError(404, "Không tìm thấy nhân viên"));

    return res.send(doc);
  } catch (err) {
    return next(new ApiError(500, "Lỗi khi lấy nhân viên"));
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0)
    return next(new ApiError(400, "Dữ liệu cập nhật không được để trống"));

  try {
    const service = new NhanVienService(MongoDB.client);
    const doc = await service.update(req.params.id, req.body);

    if (!doc) return next(new ApiError(404, "Không tìm thấy nhân viên"));

    return res.send({ message: "Cập nhật nhân viên thành công" });
  } catch (err) {
    return next(new ApiError(500, "Lỗi khi cập nhật nhân viên"));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const service = new NhanVienService(MongoDB.client);
    const doc = await service.delete(req.params.id);

    if (!doc) return next(new ApiError(404, "Không tìm thấy nhân viên"));

    return res.send({ message: "Xóa nhân viên thành công" });
  } catch (err) {
    return next(new ApiError(500, "Lỗi khi xóa nhân viên"));
  }
};

exports.deleteAll = async (_req, res, next) => {
  try {
    const service = new NhanVienService(MongoDB.client);
    const count = await service.deleteAll();

    return res.send({ message: `${count} nhân viên đã bị xóa` });
  } catch (err) {
    return next(new ApiError(500, "Lỗi khi xóa toàn bộ nhân viên"));
  }
};
