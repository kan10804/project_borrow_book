const { ObjectId } = require("mongodb");

class NhaXuatBanService {
  constructor(client) {
    this.NXB = client.db("BorrowBook").collection("NhaXuatBan");
  }

  extractData(payload) {
    const nxb = {
      MaNXB: payload.MaNXB,
      TenNXB: payload.TenNXB,
      DiaChi: payload.DiaChi,
    };

    Object.keys(nxb).forEach(
      (key) => nxb[key] === undefined && delete nxb[key]
    );

    return nxb;
  }

  // Tạo hoặc cập nhật NXB theo MaNXB
  async create(payload) {
    const nxb = this.extractData(payload);
    const result = await this.NXB.findOneAndUpdate(
      { MaNXB: nxb.MaNXB },
      { $set: nxb },
      { returnDocument: "after", upsert: true }
    );
    return result;
  }

  // Lấy tất cả
  async find(filter) {
    return await this.NXB.find(filter).toArray();
  }

  // Tìm theo tên
  async findByName(name) {
    return await this.find({
      TenNXB: { $regex: new RegExp(name), $options: "i" },
    });
  }

  // Tìm theo ID
  async findById(id) {
    return await this.NXB.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  // Cập nhật
  async update(id, payload) {
    const update = this.extractData(payload);

    const result = await this.NXB.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: "after" }
    );

    return result?.value;
  }

  // Xóa một NXB
  async delete(id) {
    return await this.NXB.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  // Xóa tất cả
  async deleteAll() {
    const result = await this.NXB.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = NhaXuatBanService;
