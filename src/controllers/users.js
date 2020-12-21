const { AuthService, UserService } = require("../services");
const { HttpCode } = require("../helpers/constants");
const userService = new UserService();
const authService = new AuthService();

const reg = async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await userService.findByEmail(email);
  if (user) {
    return next({
      status: HttpCode.CONFLICT,
      data: "Conflict",
      message: "This email is already use",
    });
  }
  try {
    const newUser = await userService.create({ name, email, password });
    return res.status(HttpCode.CREATED).json({
      status: "success",
      code: HttpCode.CREATED,
      data: {
        id: newUser.id,
        email: newUser.email,
        subscription: newUser.subscription,
        avatar: newUser.avatar,
      },
    });
  } catch (e) {
    next(e);
  }
};

const current = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await userService.getCurrentUser(userId);
    if (user) {
      return res
        .status(HttpCode.OK)
        .json({ status: "success", code: HttpCode.OK, data: { user } });
    } else {
      return next({
        status: HttpCode.UNAUTHORIZED,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const token = await authService.login({ email, password });
    if (token) {
      return res.status(HttpCode.OK).json({
        status: "success",
        code: HttpCode.OK,
        data: {
          token,
        },
      });
    }
    next({
      status: HttpCode.UNAUTHORIZED,
      message: "Invalid creadentials",
    });
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  const id = req.user.id;
  await authService.logout(id);
  return res
    .status(HttpCode.NO_CONTENT)
    .json({ status: "success", code: HttpCode.NO_CONTENT });
};

const avatars = async (req, res, next) => {
  const id = req.user.id;
  const pathFile = req.file.path;
  const url = await userService.updateAvatar(id, pathFile);
  return res
    .status(HttpCode.OK)
    .json({ status: "success", code: HttpCode.OK, avatarUrl: url });
};

const verify = async (req, res, next) => {
  try {
    const result = await userService.verify(req.params);
    if (result) {
      return res.status(HttpCode.OK).json({
        status: "success",
        code: HttpCode.OK,
        data: {
          message: "Verification successful",
        },
      });
    } else {
      return next({
        status: HttpCode.BAD_REQUEST,
        message:
          "Your verification token is not valid. Contact the administration",
      });
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  reg,
  current,
  login,
  logout,
  avatars,
  verify,
};
