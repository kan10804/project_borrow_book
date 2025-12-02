import createApiClient from "./api.service";

class BookService {
  constructor(baseUrl = "/api/books") {
    this.api = createApiClient(baseUrl);
  }

  // Lấy toàn bộ sách
  async getAll() {
    return (await this.api.get("/")).data;
  }

  // ✔ Tìm sách theo tên (đúng chuẩn axios)
  async findByName(name) {
    return (
      await this.api.get("/", {
        params: { TenSach: name },
      })
    ).data;
  }

  // Lấy 1 sách theo id
  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  // Thêm sách
  async create(data) {
    return (await this.api.post("/", data)).data;
  }

  // Cập nhật sách
  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }

  // Xóa 1 sách
  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }

  // Xóa tất cả sách
  async deleteAll() {
    return (await this.api.delete("/")).data;
  }

  // Lấy sách yêu thích
  async getFavorite() {
    return (await this.api.get("/favorite")).data;
  }
}

export default new BookService();
