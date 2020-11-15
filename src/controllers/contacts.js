const { HttpCode } = require("../helpers/constants");
const { ContactsService } = require("../services/index");
const contactService = new ContactsService();

const getAll = (req, res, next) => {
  try {
    const contacts = contactService.getAll();
    res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      data: {
        contacts,
      },
    });
  } catch (e) {
    next(e);
  }
};
const getById = (req, res, next) => {
  try {
    const contact = contactService.getById(req.params);
    if (contact) {
      return res.status(HttpCode.OK).json({
        status: "success",
        code: HttpCode.OK,
        data: {
          contact,
        },
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

const create = (req, res, next) => {
  try {
    const contact = contactService.create(req.body);
    res.status(HttpCode.CREATED).json({
      status: "success",
      code: HttpCode.CREATED,
      data: {
        contact,
      },
    });
  } catch (e) {
    next(e);
  }
};

const update = (req, res, next) => {
  try {
    const contact = contactService.update(req.params, req.body);
    if (contact) {
      return res.status(HttpCode.OK).json({
        status: "success",
        code: HttpCode.OK,
        data: {
          contact,
        },
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
const remove = (req, res, next) => {
  try {
    const contact = contactService.remove(req.params);
    if (contact) {
      return res.status(HttpCode.OK).json({
        status: "success",
        code: HttpCode.OK,
        data: {
          contact,
        },
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
