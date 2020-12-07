const Contact = require("../schemas/contact");

class ContactsRepository {
  constructor() {
    this.model = Contact;
  }

  async getAll({ page = 1, limit = 20 }) {
    const { docs: contacts, totalDocs: total } = await this.model.paginate(
      {},
      { page, limit }
    );
    return { contacts, total, page, limit };
  }
  async getById(id) {
    const result = await this.model.findOne({ _id: id });
    return result;
  }

  async create(body) {
    const result = await this.model.create(body);
    return result;
  }
  async update(id, body) {
    const result = await this.model.findByIdAndUpdate(
      { _id: id },
      { ...body },
      { new: true }
    );
    return result;
  }
  async remove(id) {
    const result = await this.model.findByIdAndRemove({
      _id: id,
    });
    return result;
  }
}
module.exports = ContactsRepository;
