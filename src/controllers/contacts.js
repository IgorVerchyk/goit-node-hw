const { HttpCode } = require("../helpers/constants");
const { ContactsService } = require("../services/index");
const contactService = new ContactsService();

const getAll = async (req, res, next) => {
  try {
    const contacts = await contactService.getAll();
    res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      data: contacts,
    });
  } catch (e) {
    next(e);
  }
};
const getById = async (req, res, next) => {
  try {
    const contact = await contactService.getById(req.params);
    if (contact) {
      return res.status(HttpCode.OK).json({
        status: "success",
        code: HttpCode.OK,
        data: contact,
      });
    } else {
      return next({
        status: HttpCode.NOT_FOUND,
        message: "Not found",
        data: "Not Found",
      });
    }
  } catch (e) {
    next(e);
  }
};

const create = async (req, res, next) => {
  try {
    const contact = await contactService.create(req.body);
    res.status(HttpCode.CREATED).json({
      status: "success",
      code: HttpCode.CREATED,
      data: contact,
    });
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const contact = await contactService.update(req.params, req.body);
    if (contact) {
      return res.status(HttpCode.OK).json({
        status: "success",
        code: HttpCode.OK,
        data: contact,
      });
    } else {
      return next({
        status: HttpCode.NOT_FOUND,
        message: "Not found this contact to update",
        data: "Not Found",
      });
    }
  } catch (e) {
    next(e);
  }
};
const remove = async (req, res, next) => {
  try {
    const contact = await contactService.remove(req.params);
    if (contact) {
      return res.status(HttpCode.OK).json({
        status: "success",
        code: HttpCode.OK,
        data: contact,
      });
    } else {
      return next({
        status: HttpCode.NOT_FOUND,
        message: "Not found this contact to remove",
        data: "Not Found",
      });
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
