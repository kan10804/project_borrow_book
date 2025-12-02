const bcrypt = require("bcryptjs");

class AuthService {
  constructor(docgiaCollection) {
    this.DocGia = docgiaCollection;
  }

  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async comparePassword(password, hashed) {
    return bcrypt.compare(password, hashed);
  }

  async findByEmail(email) {
    return await this.DocGia.findOne({ Email: email });
  }
}

module.exports = AuthService;
