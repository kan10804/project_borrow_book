const { ObjectId } = require("mongodb");

class DocGiaService {
  constructor(client) {
    this.DocGia = client.db("BorrowBook").collection("DocGia");
  }

  extractData(payload) {
    const docgia = {
      MaDocGia: payload.MaDocGia,
      HoLot: payload.HoLot,
      Ten: payload.Ten,
      NgaySinh: payload.NgaySinh,
      Phai: payload.Phai,
      DiaChi: payload.DiaChi,
      DienThoai: payload.DienThoai,
    };

    Object.keys(docgia).forEach(
      (key) => docgia[key] === undefined && delete docgia[key]
    );

    return docgia;
  }

  async create(payload) {
    const dg = this.extractData(payload);
    const result = await this.DocGia.findOneAndUpdate(
      { MaDocGia: dg.MaDocGia },
      { $set: dg },
      { returnDocument: "after", upsert: true }
    );

    return result;
  }

  async find(filter) {
    return await this.DocGia.find(filter).toArray();
  }

  async findById(id) {
    return await this.DocGia.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async findByName(name) {
    return await this.find({
      Ten: { $regex: new RegExp(name), $options: "i" },
    });
  }

  async update(id, payload) {
    const update = this.extractData(payload);

    const result = await this.DocGia.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: "after" }
    );

    return result?.value;
  }

  async delete(id) {
    return await this.DocGia.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async deleteAll() {
    const result = await this.DocGia.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = DocGiaService;
