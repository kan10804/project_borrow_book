const { ObjectId } = require("mongodb");

class NhanVienService {
  constructor(client) {
    this.NhanVien = client.db("BorrowBook").collection("NhanVien");
  }

  extractData(payload) {
    const nv = {
      MSNV: payload.MSNV,
      HoTenNV: payload.HoTenNV,
      Password: payload.Password,
      Chucvu: payload.Chucvu,
      Diachi: payload.Diachi,
      SoDienThoai: payload.SoDienThoai,
    };

    Object.keys(nv).forEach((key) => nv[key] === undefined && delete nv[key]);

    return nv;
  }

  // Tạo hoặc cập nhật theo MSNV
  async create(payload) {
    const nv = this.extractData(payload);
    const result = await this.NhanVien.findOneAndUpdate(
      { MSNV: nv.MSNV },
      { $set: nv },
      { returnDocument: "after", upsert: true }
    );
    return result;
  }

  async find(filter) {
    return await this.NhanVien.find(filter).toArray();
  }

  async findByName(name) {
    return await this.find({
      HoTenNV: { $regex: new RegExp(name), $options: "i" },
    });
  }

  async findById(id) {
    return await this.NhanVien.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async update(id, payload) {
    const update = this.extractData(payload);

    const result = await this.NhanVien.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: "after" }
    );

    return result?.value;
  }

  async delete(id) {
    return await this.NhanVien.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async deleteAll() {
    const result = await this.NhanVien.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = NhanVienService;
