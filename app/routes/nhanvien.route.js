const express = require("express");
const nhanvien = require("../controllers/nhanvien.controller");

const router = express.Router();

router.get("/msnv/:msnv", nhanvien.findByMSNV);

// CRUD mặc định
router
  .route("/")
  .get(nhanvien.findAll)
  .post(nhanvien.create)
  .delete(nhanvien.deleteAll);

router
  .route("/:id")
  .get(nhanvien.findOne)
  .put(nhanvien.update)
  .delete(nhanvien.delete);

module.exports = router;
