const { required } = require("joi");
const ContactsRepository = require("./contacts");
const UserRepository = require("./users");

module.exports = {
  ContactsRepository,
  UserRepository,
};
