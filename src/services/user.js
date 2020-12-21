const { ErrorHandler } = require("../helpers/errorHandler");
const { UsersRepository } = require("../repository");
const EmailService = require("./email");
const cloudinary = require("cloudinary").v2;
const { uuid } = require("uuid");
const fs = require("fs/promises");
require("dotenv").config();

class UserService {
  constructor() {
    this.cloudinary = cloudinary;
    this.cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });
    (this.emailService = new EmailService()),
      (this.repositories = {
        users: new UsersRepository(),
      });
  }

  #uploadCloud = (pathFile) => {
    return new Promise((resolve, reject) => {
      this.cloudinary.uploader.upload(
        pathFile,
        {
          folder: "avatars",
          transformation: {
            width: 250,
            crop: "fill",
          },
        },
        (error, result) => {
          console.log(result);
          if (error) reject(error);
          if (result) resolve(result);
        }
      );
    });
  };

  async create(body) {
    const verificationToken = uuid();
    const { email } = body;

    try {
      await this.emailService.sendEmail(verificationToken, email);
    } catch (err) {
      throw new ErrorHandler(503, err.message, "Service Unavailable");
    }

    const data = await this.repositories.users.create({
      ...body,
      verificationToken,
    });
    return data;
  }

  async getCurrentUser(id) {
    const data = await this.repositories.users.getCurrentUser(id);
    return data;
  }

  async verify({ token }) {
    const user = await this.repositories.users.findByField({
      verificationToken: token,
    });
    if (user) {
      await user.updateOne({ verify: true, verificationToken: null });
      return true;
    }
    return false;
  }

  async findByEmail(email) {
    const data = await this.repositories.users.findByEmail(email);
    return data;
  }

  async findById(id) {
    const data = await this.repositories.users.findById(id);
    return data;
  }

  async updateAvatar(id, pathFile) {
    try {
      const {
        secure_url: avatar,
        public_id: idCloudAvatar,
      } = await this.#uploadCloud(pathFile);
      const oldAvatar = await this.repositories.users.getAvatar(id);
      this.cloudinary.uploader.destroy(
        oldAvatar.idCloudAvatar,
        (err, result) => {
          console.log(err, result);
        }
      );
      await this.repositories.users.updateAvatar(id, avatar, idCloudAvatar);
      await fs.unlink(pathFile);
      return avatar;
    } catch (err) {
      throw new ErrorHandler(null, "Error upload avatar");
    }
  }
}

module.exports = UserService;
