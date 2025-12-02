import createApiClient from "./api.service";

class NhanVienService {
  constructor(baseUrl = "/api/nhanvien") {
    this.api = createApiClient(baseUrl);
  }

  // Lấy danh sách tất cả nhân viên
  async getAll() {
    return (await this.api.get("/")).data;
  }

  // Lấy nhân viên theo ID
  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  // Tìm theo tên
  async searchByName(name) {
    return (await this.api.get(`/?HoTenNV=${name}`)).data;
  }

  // Tạo nhân viên mới
  async create(data) {
    return (await this.api.post("/", data)).data;
  }

  // Cập nhật nhân viên theo id
  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }

  // Xóa 1 nhân viên
  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }

  // Xóa tất cả nhân viên
  async deleteAll() {
    return (await this.api.delete("/")).data;
  }

  // Tìm nhân viên bằng MSNV (phục vụ login)
  async findByMSNV(MSNV) {
    return (await this.api.get(`/?MSNV=${MSNV}`)).data;
  }
}

export default new NhanVienService();
