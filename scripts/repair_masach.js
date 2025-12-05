(async () => {
  const { MongoClient } = require("mongodb");
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
  const client = await MongoClient.connect(uri);
  try {
    const db = client.db("BorrowBook");
    const sach = db.collection("Sach");
    const counters = db.collection("counters");
    const changes = [];

    // handle null/missing MaSach
    const nullDocs = await sach
      .find({
        $or: [{ MaSach: null }, { MaSach: "" }, { MaSach: { $exists: false } }],
      })
      .toArray();
    for (const d of nullDocs) {
      const res = await counters.findOneAndUpdate(
        { _id: "MaSach" },
        { $inc: { seq: 1 } },
        { returnDocument: "after", upsert: true }
      );
      let doc =
        res && res.value
          ? res.value
          : await counters.findOne({ _id: "MaSach" });
      const seq = doc.seq;
      const newMa = "S" + seq;
      await sach.updateOne({ _id: d._id }, { $set: { MaSach: newMa } });
      changes.push({ _id: d._id.toString(), old: d.MaSach, new: newMa });
    }

    // find duplicates (MaSach non-null)
    const dupAgg = await sach
      .aggregate([
        { $match: { MaSach: { $ne: null, $ne: "" } } },
        { $group: { _id: "$MaSach", count: { $sum: 1 } } },
        { $match: { count: { $gt: 1 } } },
      ])
      .toArray();

    for (const g of dupAgg) {
      const docs = await sach
        .find({ MaSach: g._id })
        .sort({ _id: 1 })
        .toArray();
      // keep first, reassign the rest
      for (let i = 1; i < docs.length; i++) {
        const doc = docs[i];
        const res = await counters.findOneAndUpdate(
          { _id: "MaSach" },
          { $inc: { seq: 1 } },
          { returnDocument: "after", upsert: true }
        );
        let cdoc =
          res && res.value
            ? res.value
            : await counters.findOne({ _id: "MaSach" });
        const seq = cdoc.seq;
        const newMa = "S" + seq;
        await sach.updateOne({ _id: doc._id }, { $set: { MaSach: newMa } });
        changes.push({ _id: doc._id.toString(), old: g._id, new: newMa });
      }
    }

    // create unique index
    try {
      await sach.createIndex({ MaSach: 1 }, { unique: true, sparse: true });
    } catch (e) {
      console.error("Index creation error:", e.message);
    }

    const counterDoc = await counters.findOne({ _id: "MaSach" });
    console.log("Done. Changes:");
    console.log(JSON.stringify(changes, null, 2));
    console.log("Counter after changes:", JSON.stringify(counterDoc, null, 2));
  } finally {
    await client.close();
  }
})();
