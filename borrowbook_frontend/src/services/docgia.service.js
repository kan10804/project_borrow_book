import createApiClient from "./api.service";

class DocGiaService {
  constructor(baseUrl = "/api/docgia") {
    this.api = createApiClient(baseUrl);
  }

  // Lấy tất cả độc giả
  async getAll() {
    return (await this.api.get("/")).data;
  }

  // Lấy theo ID
  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  // Tìm theo tên
  async searchByName(name) {
    return (await this.api.get(`/?Ten=${name}`)).data;
  }

  // Tạo độc giả mới
  async create(data) {
    return (await this.api.post("/", data)).data;
  }

  // Cập nhật độc giả
  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }

  // Xóa 1 độc giả
  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }

  // Xóa tất cả độc giả
  async deleteAll() {
    return (await this.api.delete("/")).data;
  }

  // Tìm độc giả theo email (phục vụ login)
  async findByEmail(email) {
    return (await this.api.get(`/?Email=${email}`)).data;
  }
}

export default new DocGiaService();
