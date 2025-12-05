const express = require("express");
const cors = require("cors");
const ApiError = require("./app/api-error");
const app = express();

const bookRouter = require("./app/routes/book.route");
const docgiaRouter = require("./app/routes/docgia.route");
const authRouter = require("./app/routes/auth.route");
const nhaxuatbanRouter = require("./app/routes/nhaxuatban.route");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Chào bạn đến với web mượn sách." });
});

// Gắn router
app.use("/api/theodoimuonsach", require("./app/routes/theodoimuonsach.route"));
app.use("/api/books", bookRouter);
app.use("/api/docgia", docgiaRouter);
app.use("/api/auth", authRouter);
app.use("/api/nhaxuatban", nhaxuatbanRouter);

// handle 404 response
app.use((req, res, next) => {
  return next(new ApiError(404, "Resource not found"));
});

// error handling
app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
