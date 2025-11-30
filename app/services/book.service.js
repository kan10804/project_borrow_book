const { ObjectId } = require("mongodb");

class BookService {
  constructor(client) {
    // Kết nối tới collection "Sach" trong database BorrowBook
    this.Book = client.db("BorrowBook").collection("Sach");
  }

  // Lọc dữ liệu đầu vào (tránh field thừa)
  extractBookData(payload) {
    const book = {
      MaSach: payload.MaSach,
      TenSach: payload.TenSach,
      TacGia: payload.TacGia,
      NamXuatBan: payload.NamXuatBan,
      SoQuyen: payload.SoQuyen,
      DonGia: payload.DonGia,
      MaNXB: payload.MaNXB,
    };
    Object.keys(book).forEach(
      (key) => book[key] === undefined && delete book[key]
    );

    return book;
  }

  // Tạo sách mới
  async create(payload) {
    const book = this.extractBookData(payload);

   
    const result = await this.Book.findOneAndUpdate(
      { MaSach: book.MaSach }, 
      { $set: book }, 
      { returnDocument: "after", upsert: true } 
    );

    return result;
  }

  // Tìm tất cả sách theo filter
  async find(filter) {
    const cursor = await this.Book.find(filter);
    return await cursor.toArray();
  }

  // Tìm sách theo tên
  async findByName(TenSach) {
    return await this.find({
      TenSach: { $regex: new RegExp(TenSach), $options: "i" },
    });
  }

  // Tìm sách theo id
  async findById(id) {
    return await this.Book.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  // Cập nhật sách theo id
  async update(id, payload) {
    const filter = { _id: new ObjectId(id) };
    const update = this.extractBookData(payload);

    const result = await this.Book.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );

    const document = result?.value || result;
    console.log("Kết quả cập nhật:", document);
    return document;
  }

  // Xóa 1 sách theo id
  async delete(id) {
    const result = await this.Book.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  // Tìm sách được đánh dấu yêu thích
  async findFavorite() {
    return await this.find({ favorite: true });
  }

  // Xóa toàn bộ sách
  async deleteAll() {
    const result = await this.Book.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = BookService;
