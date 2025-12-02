import createApiClient from "./api.service";

class AuthService {
  constructor(baseUrl = "/api/auth") {
    this.api = createApiClient(baseUrl);
  }

  // Đăng ký
  async register(data) {
    return (await this.api.post("/register", data)).data;
  }

  // Đăng nhập
  async login(data) {
    const res = (await this.api.post("/login", data)).data;

    // Lưu token lại để dùng cho các request sau
    if (res.token) {
      localStorage.setItem("token", res.token);
    }

    return res;
  }

  // Đăng xuất
  async logout() {
    localStorage.removeItem("token");
    return (await this.api.post("/logout")).data;
  }

  // Lấy token để gửi cho backend
  getToken() {
    return localStorage.getItem("token");
  }
}

export default new AuthService();
