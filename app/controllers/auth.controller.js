// auth.controller.js
const DocGiaService = require("../services/docgia.service");
const NhanVienService = require("../services/nhanvien.service");
const AuthService = require("../services/auth.service");
const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "SECRET_KEY_JWT";

// Check xem password có phải bcrypt chưa
function isHashed(pwd) {
  return typeof pwd === "string" && pwd.startsWith("$2");
}

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ message: "Thiếu username hoặc password" });
    }

    const docGiaService = new DocGiaService(MongoDB.client);
    const nhanVienService = new NhanVienService(MongoDB.client);

    let user = null;
    let role = null;

    // Tìm DocGia theo Email
    if (typeof username === "string" && username.includes("@")) {
      user = await docGiaService.findByEmail(username);
      if (user) role = "docgia";
    }

    // Nếu không tìm được, thử tìm NhanVien theo MSNV
    if (!user) {
      const asNum = Number(username);
      if (!isNaN(asNum) && asNum > 0) {
        user = await nhanVienService.findByMSNV(asNum);
        if (user) role = "nhanvien";
      }
    }

    // Nếu không tìm được, tìm NhanVien theo SĐT (loại bỏ ký tự không phải số)
    if (!user) {
      const digitsOnly = String(username).replace(/\D+/g, "");
      if (digitsOnly.length >= 7) {
        user = await nhanVienService.findByPhone(digitsOnly);
        if (user) role = "nhanvien";
      }
    }

    // Nếu vẫn không tìm được, thử DocGia theo MaDocGia
    if (!user) {
      const asNum = Number(username);
      if (!isNaN(asNum) && asNum > 0) {
        user = await docGiaService.findByMaDocGia(asNum);
        if (user) role = "docgia";
      }
    }

    if (!user) {
      return res.status(400).json({ message: "Sai tài khoản hoặc mật khẩu" });
    }

    // Lấy password từ DB
    let dbPwd = user.Password ?? user.password ?? "";
    if (!dbPwd) {
      return res.status(400).json({ message: "Tài khoản chưa có mật khẩu" });
    }

    // So sánh mật khẩu
    let match = false;
    if (isHashed(String(dbPwd))) {
      match = await bcrypt.compare(String(password), String(dbPwd));
    } else {
      match = String(password) === String(dbPwd);
    }

    if (!match) {
      return res.status(400).json({ message: "Sai mật khẩu" });
    }
    const payload = { id: user._id, role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    const userObj = JSON.parse(JSON.stringify(user));
    delete userObj.password;

    return res.json({
      message: "Đăng nhập thành công",
      role,
      token,
      user: userObj,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

exports.logout = async (_req, res) => {
  return res.send({
    message: "Đăng xuất thành công!",
  });
};
