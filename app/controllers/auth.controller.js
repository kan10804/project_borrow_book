const DocGiaService = require("../services/docgia.service");
const AuthService = require("../services/auth.service");
const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  const { MaDocGia, HoLot, Ten, Email, Password } = req.body;

  if (!Email || !Password)
    return next(new ApiError(400, "Email và mật khẩu không được để trống"));

  try {
    const docgiaService = new DocGiaService(MongoDB.client);
    const authService = new AuthService(docgiaService.DocGia);

    // Kiểm tra email tồn tại
    const existed = await authService.findByEmail(Email);
    if (existed) return next(new ApiError(400, "Email đã tồn tại"));

    // Hash password
    const hashed = await authService.hashPassword(Password);

    // Tạo độc giả mới
    const result = await docgiaService.create({
      MaDocGia,
      HoLot,
      Ten,
      Email,
      Password: hashed,
    });

    return res.send({
      message: "Đăng ký thành công",
      docgia: result.value,
    });
  } catch (err) {
    return next(new ApiError(500, "Lỗi khi đăng ký"));
  }
};

exports.login = async (req, res, next) => {
  const { Email, Password } = req.body;

  if (!Email || !Password)
    return next(new ApiError(400, "Email và mật khẩu không được để trống"));

  try {
    const docgiaService = new DocGiaService(MongoDB.client);
    const authService = new AuthService(docgiaService.DocGia);

    // Kiểm email tồn tại
    const user = await authService.findByEmail(Email);
    if (!user) return next(new ApiError(404, "Email không tồn tại"));

    // Kiểm mật khẩu
    const ok = await authService.comparePassword(Password, user.Password);
    if (!ok) return next(new ApiError(401, "Sai mật khẩu"));

    // Tạo token
    const token = jwt.sign({ id: user._id, role: "user" }, "SECRET_KEY_JWT", {
      expiresIn: "2h",
    });

    return res.send({
      message: "Đăng nhập thành công",
      token,
      user,
    });
  } catch (err) {
    return next(new ApiError(500, "Lỗi khi đăng nhập"));
  }
};

exports.logout = async (_req, res) => {
  return res.send({
    message: "Đăng xuất thành công (client hãy xoá token ở localStorage)",
  });
};
