class DocGiaService {
  constructor(client) {
    this.DocGia = client.db("BorrowBook").collection("DocGia");
  }

  extractData(payload) {
    const docgia = {
      HoLot: payload.HoLot || "",
      Ten: payload.Ten || "",
      NgaySinh: payload.NgaySinh || "",
      Phai: payload.Phai || "",
      DiaChi: payload.DiaChi || "",
      DienThoai: payload.DienThoai || "",
      Email: payload.Email,
      Password: payload.Password,
    };

    // Xóa key undefined
    Object.keys(docgia).forEach(
      (key) => docgia[key] === undefined && delete docgia[key]
    );

    return docgia;
  }

  // CREATE
  async create(payload) {
    const dg = this.extractData(payload);
    dg.MaDocGia = payload.MaDocGia; // vẫn giữ MaDocGia khi tạo

    const result = await this.DocGia.insertOne(dg);
    return { _id: result.insertedId, ...dg };
  }

  // Tìm tất cả
  async find(filter) {
    return await this.DocGia.find(filter).toArray();
  }

  // 🔥 Tìm theo MaDocGia
  async findByMaDocGia(maDocGia) {
    return await this.DocGia.findOne({ MaDocGia: Number(maDocGia) });
  }

  // Tìm theo Email
  async findByEmail(email) {
    return await this.DocGia.findOne({ Email: email });
  }

  // Tìm theo tên
  async findByName(name) {
    return await this.find({
      Ten: { $regex: new RegExp(name, "i") },
    });
  }

  // UPDATE theo MaDocGia
  async update(maDocGia, payload) {
    delete payload._id;
    delete payload.MaDocGia;

    const update = this.extractData(payload);

    const result = await this.DocGia.findOneAndUpdate(
      { MaDocGia: Number(maDocGia) },
      { $set: update },
      { returnDocument: "after" }
    );

    return result;
  }

  // XÓA theo MaDocGia
  async delete(maDocGia) {
    return await this.DocGia.findOneAndDelete({
      MaDocGia: Number(maDocGia),
    });
  }

  // XÓA TẤT CẢ
  async deleteAll() {
    const result = await this.DocGia.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = DocGiaService;
