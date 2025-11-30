const { ObjectId } = require("mongodb");

class TheoDoiMuonSachService {
  constructor(client) {
    this.MuonSach = client.db("BorrowBook").collection("TheoDoiMuonSach");
  }

  extractData(payload) {
    const muon = {
      MaDocGia: payload.MaDocGia,
      MaSach: payload.MaSach,
      NgayMuon: payload.NgayMuon,
      NgayTra: payload.NgayTra,
    };

    Object.keys(muon).forEach(
      (key) => muon[key] === undefined && delete muon[key]
    );

    return muon;
  }

  // Thêm hoặc cập nhật theo MaDocGia + MaSach
  async create(payload) {
    const muon = this.extractData(payload);

    const result = await this.MuonSach.findOneAndUpdate(
      { MaDocGia: muon.MaDocGia, MaSach: muon.MaSach },
      { $set: muon },
      { returnDocument: "after", upsert: true }
    );

    return result;
  }

  async find(filter) {
    return await this.MuonSach.find(filter).toArray();
  }

  async findByDocGia(name) {
    return await this.find({
      MaDocGia: { $regex: new RegExp(name), $options: "i" },
    });
  }

  async findById(id) {
    return await this.MuonSach.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async update(id, payload) {
    const update = this.extractData(payload);

    const result = await this.MuonSach.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: "after" }
    );

    return result?.value;
  }

  async delete(id) {
    return await this.MuonSach.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  // Xóa tất cả bản ghi mượn sách
  async deleteAll() {
    const result = await this.MuonSach.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = TheoDoiMuonSachService;
