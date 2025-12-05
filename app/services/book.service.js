const { ObjectId } = require("mongodb");

class BookService {
  constructor(client) {
    this.client = client;
    this.Book = client.db("BorrowBook").collection("Sach");
  }

  // Lọc dữ liệu để chỉ lấy đúng các field cần thiết
  extractBookData(payload) {
    const book = {
      MaSach: payload.MaSach,
      TenSach: payload.TenSach,
      TacGia: payload.TacGia,
      MoTa: payload.MoTa,
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

    // If MaSach provided, upsert as before. If not, generate a new incremental MaSach (S1, S2...)
    if (book.MaSach) {
      const result = await this.Book.findOneAndUpdate(
        { MaSach: book.MaSach },
        { $set: book },
        { returnDocument: "after", upsert: true }
      );

      return result.value;
    }

    // Generate new MaSach using an atomic counter document to avoid races
    const counters = this.client.db("BorrowBook").collection("counters");

    // Ensure counter exists and is initialized to the current max numeric suffix
    let existingCounter = await counters.findOne({ _id: "MaSach" });
    if (!existingCounter) {
      // compute max numeric suffix among existing MaSach values (handles S1 and S001)
      const docs = await this.Book.find({ MaSach: { $regex: /^S0*\d+$/ } })
        .project({ MaSach: 1 })
        .toArray();
      let maxNum = 0;
      for (const d of docs) {
        const m = d.MaSach && d.MaSach.match(/^S0*(\d+)$/);
        if (m) {
          const n = parseInt(m[1], 10);
          if (!isNaN(n) && n > maxNum) maxNum = n;
        }
      }
      // insert counter with current max (so next increment will be max+1)
      await counters.insertOne({ _id: "MaSach", seq: maxNum });
    }

    const seqDoc = await counters.findOneAndUpdate(
      { _id: "MaSach" },
      { $inc: { seq: 1 } },
      { returnDocument: "after", upsert: true }
    );

    const seq = seqDoc.value && seqDoc.value.seq ? seqDoc.value.seq : 1;
    book.MaSach = `S${seq}`;

    const insertRes = await this.Book.insertOne(book);
    if (insertRes.insertedId) {
      const created = await this.Book.findOne({ _id: insertRes.insertedId });
      return created;
    }

    return null;
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
