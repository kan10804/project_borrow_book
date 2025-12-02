const DocGiaService = require("../services/docgia.service");
const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const bcrypt = require("bcryptjs");

// 1. Đăng ký độc giả
exports.create = async (req, res, next) => {
  try {
    const { Email, Password } = req.body;

    if (!Email) return next(new ApiError(400, "Email không được để trống"));
    if (!Password)
      return next(new ApiError(400, "Mật khẩu không được để trống"));

    const service = new DocGiaService(MongoDB.client);

    // Kiểm tra email tồn tại
    const exist = await service.findByEmail(Email);
    if (exist) return next(new ApiError(400, "Email đã tồn tại"));

    // Hash mật khẩu
    const hashed = await bcrypt.hash(Password, 10);

    const newUser = {
      MaDocGia: Date.now(), // Sử dụng MaDocGia thay vì _id
      Email,
      Password: hashed,
      HoLot: req.body.HoLot || "",
      Ten: req.body.Ten || "",
      NgaySinh: req.body.NgaySinh || "",
      Phai: req.body.Phai || "",
      DiaChi: req.body.DiaChi || "",
      DienThoai: req.body.DienThoai || "",
    };

    const doc = await service.create(newUser);

    return res.send({
      message: "Đăng ký thành công",
      user: doc,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi đăng ký độc giả"));
  }
};

// 2. Lấy toàn bộ độc giả
exports.findAll = async (req, res, next) => {
  try {
    const service = new DocGiaService(MongoDB.client);
    const { Ten } = req.query;
    let docs = [];

    if (Ten) docs = await service.findByName(Ten);
    else docs = await service.find({});

    return res.send(docs);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy danh sách độc giả"));
  }
};

// 3. Lấy theo MaDocGia
exports.findOne = async (req, res, next) => {
  try {
    const service = new DocGiaService(MongoDB.client);

    const doc = await service.findByMaDocGia(req.params.id);

    if (!doc) return next(new ApiError(404, "Không tìm thấy độc giả"));

    return res.send(doc);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy độc giả"));
  }
};

// 4. UPDATE theo MaDocGia
exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Dữ liệu cập nhật không được để trống"));
  }

  try {
    const service = new DocGiaService(MongoDB.client);

    const doc = await service.update(req.params.id, req.body);

    if (!doc) {
      return next(new ApiError(404, "Không tìm thấy độc giả"));
    }

    return res.send({
      message: "Cập nhật độc giả thành công",
      user: doc,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi cập nhật độc giả"));
  }
};

// 5. XÓA theo MaDocGia
exports.delete = async (req, res, next) => {
  try {
    const service = new DocGiaService(MongoDB.client);
    const doc = await service.delete(req.params.id);

    if (!doc) return next(new ApiError(404, "Không tìm thấy độc giả"));

    return res.send({ message: "Xóa độc giả thành công" });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xóa độc giả"));
  }
};

// 6. XÓA TẤT CẢ
exports.deleteAll = async (_req, res, next) => {
  try {
    const service = new DocGiaService(MongoDB.client);
    const count = await service.deleteAll();

    return res.send({ message: `${count} độc giả đã bị xóa` });
  } catch (err) {
    return next(new ApiError(500, "Lỗi khi xóa toàn bộ độc giả"));
  }
};

// 7. 🔥 API TÌM ĐỘC GIẢ THEO EMAIL
exports.findByEmail = async (req, res, next) => {
  try {
    const email = req.params.email;

    if (!email) return next(new ApiError(400, "Thiếu email"));

    const service = new DocGiaService(MongoDB.client);
    const user = await service.findByEmail(email);

    if (!user) return next(new ApiError(404, "Không tìm thấy độc giả"));

    return res.send(user);
  } catch (err) {
    console.log(err);
    return next(new ApiError(500, "Lỗi tìm độc giả theo email"));
  }
};
