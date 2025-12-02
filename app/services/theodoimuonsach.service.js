const { ObjectId } = require("mongodb");

class TheoDoiMuonSachService {
  constructor(client) {
    this.MuonSach = client.db("BorrowBook").collection("TheoDoiMuonSach");
  }

  extractData(payload) {
    const muon = {
      MaDocGia:
        payload.MaDocGia !== undefined ? Number(payload.MaDocGia) : undefined,
      MaSach: payload.MaSach,
      NgayMuon: payload.NgayMuon,
      NgayTra: payload.NgayTra,
      TrangThai: payload.TrangThai,
    };

    Object.keys(muon).forEach(
      (key) => muon[key] === undefined && delete muon[key]
    );

    return muon;
  }

  // Tạo hoặc cập nhật khi MaDocGia + MaSach giống nhau
  async create(payload) {
    const muon = this.extractData(payload);

    // nếu không có trạng thái thì tự thêm mặc định
    if (!muon.TrangThai) {
      muon.TrangThai = "Chờ duyệt"; // hoặc "đang mượn"
    }

    const result = await this.MuonSach.findOneAndUpdate(
      { MaDocGia: muon.MaDocGia, MaSach: muon.MaSach },
      { $set: muon },
      { returnDocument: "after", upsert: true }
    );

    return result.value;
  }

  // Lấy danh sách có thể kèm filter
  async find(filter) {
    return await this.MuonSach.find(filter).toArray();
  }

  // Lấy theo id
  async findById(id) {
    return await this.MuonSach.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  // Cập nhật theo id
  async update(id, payload) {
    const update = this.extractData(payload);

    const result = await this.MuonSach.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: "after" }
    );

    return result?.value;
  }

  // Xóa theo id
  async delete(id) {
    return await this.MuonSach.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  // Xóa toàn bộ theo MaDocGia
  async deleteAllByDocGia(maDocGia) {
    return await this.MuonSach.deleteMany({
      MaDocGia: Number(maDocGia),
    });
  }
}

module.exports = TheoDoiMuonSachService;
