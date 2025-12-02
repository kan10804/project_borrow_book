const { ObjectId } = require("mongodb");

class BookService {
  constructor(client) {
    this.Book = client.db("BorrowBook").collection("Sach");
  }

  // Lọc dữ liệu để chỉ lấy đúng các field cần thiết
  extractBookData(payload) {
    const book = {
      MaSach: payload.MaSach,
      TenSach: payload.TenSach,
      TacGia: payload.TacGia,
      NamXuatBan: payload.NamXuatBan,
      SoQuyen: payload.SoQuyen,
      DonGia: payload.DonGia,
      MaNXB: payload.MaNXB,
      AnhSach: payload.AnhSach,
    };

    // loại bỏ các trường undefined
    Object.keys(book).forEach(
      (key) => book[key] === undefined && delete book[key]
    );

    return book;
  }

  // Tạo sách (hoặc update nếu MaSach trùng)
  async create(payload) {
    const book = this.extractBookData(payload);

    const result = await this.Book.findOneAndUpdate(
      { MaSach: book.MaSach },
      { $set: book },
      { returnDocument: "after", upsert: true }
    );

    return result;
  }

  async find(filter) {
    const cursor = await this.Book.find(filter);
    return await cursor.toArray();
  }

  async findByName(TenSach) {
    return await this.find({
      TenSach: { $regex: new RegExp(TenSach), $options: "i" },
    });
  }

  async findById(id) {
    return await this.Book.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async update(id, payload) {
    const filter = { _id: new ObjectId(id) };
    const update = this.extractBookData(payload);

    const result = await this.Book.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );

    return result?.value || result;
  }

  async delete(id) {
    return await this.Book.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async findFavorite() {
    return await this.find({ favorite: true });
  }

  async deleteAll() {
    const result = await this.Book.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = BookService;
