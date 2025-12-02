import createApiClient from "./api.service";

class NhaXuatBanService {
  constructor(baseUrl = "/api/nhaxuatban") {
    this.api = createApiClient(baseUrl);
  }

  // Lấy tất cả NXB
  async getAll() {
    return (await this.api.get("/")).data;
  }

  // Tìm NXB theo ID
  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  // Tìm theo tên NXB
  async searchByName(name) {
    return (await this.api.get(`/?TenNXB=${name}`)).data;
  }

  // Thêm mới NXB
  async create(data) {
    return (await this.api.post("/", data)).data;
  }

  // Cập nhật NXB
  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }

  // Xóa NXB
  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }

  // Xóa toàn bộ
  async deleteAll() {
    return (await this.api.delete("/")).data;
  }
}

export default new NhaXuatBanService();
