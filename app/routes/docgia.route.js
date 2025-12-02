const express = require("express");
const docgia = require("../controllers/docgia.controller");

const router = express.Router();

// TÌM THEO EMAIL (thêm mới)
router.get("/email/:email", docgia.findByEmail);

// CRUD chính
router
  .route("/")
  .get(docgia.findAll)
  .post(docgia.create)
  .delete(docgia.deleteAll);

router
  .route("/:id")
  .get(docgia.findOne)
  .put(docgia.update)
  .delete(docgia.delete);

module.exports = router;
