const User = require("../schemas/users");

class UsersRepository {
  constructor() {
    this.model = User;
  }

  async findById(id) {
    const result = await this.model.findOne({ _id: id });
    return result;
  }

  async findByEmail(email) {
    const result = await this.model.findOne({ email });
    return result;
  }

  async create(body) {
    const user = new this.model(body);
    return user.save();
  }

  async updateToken(id, token) {
    await this.model.updateOne({ _id: id }, { token });
  }

  async updateAvatar(id, avatar, cloudAvatarId) {
    await this.model.updateOne({ _id: id }, { avatar, cloudAvatarId });
  }

  async getAvatar(id) {
    const { avatar, cloudAvatarId } = await this.model.findOne({ _id: id });
    return { avatar, cloudAvatarId };
  }
}

module.exports = UsersRepository;
